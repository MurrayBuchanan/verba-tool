from fastapi import Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.authentication_service import AuthenticationService
from app.schemas.models import User

authentication_service = AuthenticationService()

async def get_current_user(authorisation: str = Header(..., alias="Authorisation"), db: AsyncSession = Depends(get_db)) -> User:
    if not authorisation:
        raise HTTPException(status_code=401, detail="Invalid authorisation header")
    
    try:
        token = authorisation[7:] # Remove prefix "Bearer "
        token = await authentication_service.validate_token(token)
        user_id = token["sub"]
        
        # Get or create user
        user = await db.get(User, user_id)
        if user is None:
            user = User(id=user_id)
            db.add(user)
            await db.flush()
            await db.commit()
        
        return user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Authorisation failed")

async def get_user_id(user: User = Depends(get_current_user)) -> str:
    return user.id