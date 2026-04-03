import pathlib

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import get_db
from app.core.authentication import get_user_id
from app.core.config import UPLOADS_ROOT
from app.structures.models import Profile as ProfileModel, TranscriptMetadata, TranscriptFeatures, TranscriptSegment, Intervention as InterventionModel
from app.structures.schemas import Profile as ProfileSchema

router = APIRouter(prefix="/profiles", tags=["profiles"])

PICTURE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
MAX_PICTURE_BYTES = 5 * 1024 * 1024


def _safe_user_segment(user_id: str) -> str:
    return user_id.replace("/", "_").replace("\\", "_")


def picture_public_url(picture_path: str | None) -> str | None:
    if not picture_path:
        return None
    return "/static/" + picture_path.replace("\\", "/")


def _abs_upload_path(relative: str) -> pathlib.Path:
    return pathlib.Path(UPLOADS_ROOT) / relative.replace("\\", "/")


def profile_to_dict(db_profile: ProfileModel) -> dict:
    return {
        "id": db_profile.id,
        "first_name": db_profile.first_name,
        "last_name": db_profile.last_name,
        "description": db_profile.description,
        "picture_url": picture_public_url(db_profile.picture_path),
    }


# Create a new profile for user
@router.post("")
async def create_profile(profile: ProfileSchema, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        db_profile = ProfileModel(
            user_id=user_id,
            first_name=profile.first_name,
            last_name=profile.last_name,
            description=profile.description,
        )

        db.add(db_profile)
        await db.flush()
        await db.refresh(db_profile)
        await db.commit()

        return JSONResponse(content=profile_to_dict(db_profile))
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot create profile")

# Get all profiles for user for main view
@router.get("")
async def get_profiles(user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(
            select(ProfileModel)
            .where(ProfileModel.user_id == user_id)
            .order_by(ProfileModel.last_name.asc(), ProfileModel.first_name.asc())
        )
        profiles = result.scalars().all()

        db_profiles = [profile_to_dict(profile) for profile in profiles]

        return JSONResponse(content={"profiles": db_profiles})
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot fetch profiles")

# Get a specific profile for user for detail view
@router.get("/{profile_id}")
async def get_profile(profile_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))
        db_profile = result.scalar_one_or_none()
        
        if db_profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return JSONResponse(content=profile_to_dict(db_profile))
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot get profile")

# Update profile details
@router.put("/{profile_id}")
async def update_profile(profile_id: int, profile: ProfileSchema, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))
        db_profile = result.scalar_one_or_none()
        
        if db_profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")

        db_profile.first_name = profile.first_name
        db_profile.last_name = profile.last_name
        db_profile.description = profile.description
        
        await db.commit()
        await db.refresh(db_profile)

        return JSONResponse(content=profile_to_dict(db_profile))
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot update profile")


@router.post("/{profile_id}/picture")
async def upload_profile_picture(
    profile_id: int,
    file: UploadFile = File(...),
    user_id: str = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
) -> JSONResponse:
    try:
        if file.content_type not in PICTURE_TYPES:
            raise HTTPException(status_code=400, detail="Image must be JPEG, PNG, or WebP")

        result = await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))
        db_profile = result.scalar_one_or_none()
        if db_profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")

        contents = await file.read()
        if len(contents) > MAX_PICTURE_BYTES:
            raise HTTPException(status_code=400, detail="Image must be 5 MB or smaller")

        ext = PICTURE_TYPES[file.content_type]
        safe_user = _safe_user_segment(user_id)
        dir_path = pathlib.Path(UPLOADS_ROOT) / "profile_pictures" / safe_user
        dir_path.mkdir(parents=True, exist_ok=True)

        for existing in dir_path.glob(f"{profile_id}.*"):
            try:
                existing.unlink()
            except OSError:
                pass

        if db_profile.picture_path:
            old = _abs_upload_path(db_profile.picture_path)
            if old.is_file():
                try:
                    old.unlink()
                except OSError:
                    pass

        relative = f"profile_pictures/{safe_user}/{profile_id}{ext}"
        dest = pathlib.Path(UPLOADS_ROOT) / relative.replace("\\", "/")
        dest.write_bytes(contents)

        db_profile.picture_path = relative
        await db.commit()
        await db.refresh(db_profile)

        return JSONResponse(content=profile_to_dict(db_profile))
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot upload profile picture")


@router.delete("/{profile_id}/picture")
async def delete_profile_picture(profile_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))
        db_profile = result.scalar_one_or_none()
        if db_profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")

        if db_profile.picture_path:
            path = _abs_upload_path(db_profile.picture_path)
            if path.is_file():
                try:
                    path.unlink()
                except OSError:
                    pass
            db_profile.picture_path = None

        await db.commit()
        await db.refresh(db_profile)

        return JSONResponse(content=profile_to_dict(db_profile))
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot remove profile picture")

# Delete a profile
@router.delete("/{profile_id}")
async def delete_profile(profile_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))
        profile = result.scalar_one_or_none()
        
        if profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")

        if profile.picture_path:
            path = _abs_upload_path(profile.picture_path)
            if path.is_file():
                try:
                    path.unlink()
                except OSError:
                    pass
            
        # Delete profile & dependencies
        transcript_ids = await db.execute(select(TranscriptMetadata.id).where(TranscriptMetadata.profile_id == profile_id))
        for tid in transcript_ids.scalars().all():
            await db.execute(delete(TranscriptSegment).where(TranscriptSegment.transcript_metadata_id == tid))
            await db.execute(delete(TranscriptFeatures).where(TranscriptFeatures.transcript_metadata_id == tid))
            await db.execute(delete(TranscriptMetadata).where(TranscriptMetadata.id == tid))
        await db.execute(delete(InterventionModel).where(InterventionModel.profile_id == profile_id))
        await db.execute(delete(ProfileModel).where(ProfileModel.id == profile_id))
        await db.commit()
        return JSONResponse(content={"message": "Profile deleted"})
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot delete profile")
