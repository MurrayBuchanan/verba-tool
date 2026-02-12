from fastapi import Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.database import get_db
from app.core.config import API_TOKEN
from app.schemas.models import User

async def get_current_user(authorisation: Optional[str] = Header(None, alias="Authorisation"), user: Optional[str] = Header(None, alias="User-Id"), db: AsyncSession = Depends(get_db)) -> User:
    if not authorisation:
        raise HTTPException(status_code=401, detail="Missing authorisation header")
    if authorisation != API_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid API token")
    if not user:
        raise HTTPException(status_code=401, detail="Missing user ID")
        
    # Get or create user
    user_id = user
    user = await db.get(User, user_id)
    if user is None:
        user = User(id=user_id)
        db.add(user)
        await db.flush()
        await db.commit()
    return user


async def get_user_id(user: User = Depends(get_current_user)) -> str:
    return user.id