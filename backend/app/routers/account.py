from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.authentication import get_current_user
from app.structures.models import User
from app.structures.schemas import AccountOut, AccountUpdate

router = APIRouter(prefix="/account", tags=["account"])

# Keep in sync with frontend constants/focus-areas.ts (FocusAreaId values).
ALLOWED_FOCUS_AREAS = frozenset({
    "aphasia",
    "child_language",
    "concussion",
    "dementia_language",
    "speech_practice",
    "general",
})


@router.get("", response_model=AccountOut)
async def get_account(user: User = Depends(get_current_user)) -> AccountOut:
    return AccountOut(focus_area_id=user.focus_area_id)


@router.patch("", response_model=AccountOut)
async def update_account(
    body: AccountUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AccountOut:
    if body.focus_area_id not in ALLOWED_FOCUS_AREAS:
        raise HTTPException(status_code=400, detail="Invalid focus_area_id")
    user.focus_area_id = body.focus_area_id
    await db.commit()
    await db.refresh(user)
    return AccountOut(focus_area_id=user.focus_area_id)
