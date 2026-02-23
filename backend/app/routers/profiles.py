from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import get_db
from app.core.authentication import get_user_id
from app.structures.models import Profile as ProfileModel, TranscriptMetadata, TranscriptFeatures, TranscriptSegment, Intervention as InterventionModel
from app.structures.schemas import Profile as ProfileSchema

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.post("")
async def create_profile(profile: ProfileSchema, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        db_profile = ProfileModel(
            user_id=user_id,
            name=profile.name,
            description=profile.description,
        )

        # Add profile to database
        db.add(db_profile)
        await db.flush()
        await db.refresh(db_profile)
        await db.commit()

        return JSONResponse(content={"id": db_profile.id, "name": db_profile.name, "description": db_profile.description})
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot create profile")

@router.get("")
async def get_profiles(user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        # Get all profiles for user
        result = await db.execute(select(ProfileModel).where(ProfileModel.user_id == user_id).order_by(ProfileModel.id.desc()))
        profiles = result.scalars().all()

        db_profiles = []
        for profile in profiles:
            db_profiles.append({
                "id": profile.id,
                "name": profile.name,
                "description": profile.description,
            })

        return JSONResponse(content={"profiles": db_profiles})
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot fetch profiles")

@router.get("/{profile_id}")
async def get_profile(profile_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        # Check if profile exists
        result = await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))
        db_profile = result.scalar_one_or_none()
        
        if db_profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return JSONResponse(content={"id": db_profile.id, "name": db_profile.name, "description": db_profile.description})
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot get profile")

@router.put("/{profile_id}")
async def update_profile(profile_id: int, profile: ProfileSchema, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        # Check if profile exists
        result = await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))
        db_profile = result.scalar_one_or_none()
        
        if db_profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")

        # Update profile
        db_profile.name = profile.name
        db_profile.description = profile.description
        
        await db.commit()
        await db.refresh(db_profile)

        return JSONResponse(content={"id": db_profile.id, "name": db_profile.name, "description": db_profile.description})
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot update profile")

@router.delete("/{profile_id}")
async def delete_profile(profile_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        # Check if profile exists
        result = await db.execute(select(ProfileModel).where(ProfileModel.id == profile_id, ProfileModel.user_id == user_id))
        profile = result.scalar_one_or_none()
        
        if profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")
        # Delete profile & dependencies
        profile_transcripts = await db.execute(select(TranscriptMetadata.id).where(TranscriptMetadata.profile_id == profile_id))
        for transcript in profile_transcripts:
            await db.execute(delete(TranscriptSegment).where(TranscriptSegment.transcript_metadata_id == transcript.id))
            await db.execute(delete(TranscriptFeatures).where(TranscriptFeatures.transcript_metadata_id == transcript.id))
            await db.execute(delete(TranscriptMetadata).where(TranscriptMetadata.id == transcript.id))
        await db.execute(delete(InterventionModel).where(InterventionModel.profile_id == profile_id))
        await db.execute(delete(ProfileModel).where(ProfileModel.id == profile_id))
        await db.commit()
        return JSONResponse(content={"message": "Profile deleted"})
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot delete profile")