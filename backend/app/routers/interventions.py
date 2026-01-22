from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.config import API_TOKEN
from app.core.database import get_db
from app.schemas.models import User, Intervention as InterventionModel
from app.schemas.schemas import Intervention as InterventionSchema

router = APIRouter(prefix="/interventions", tags=["interventions"])

async def get_or_create_user(db: AsyncSession, user_id: str) -> User:
    user = await db.get(User, user_id)
    if user is None:
        user = User(id=user_id)
        db.add(user)
        await db.flush()
    return user


@router.post("/{user_id}")
async def create_intervention(user_id: str, intervention: InterventionSchema, authorization: str = Header(..., alias="Authorization"), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    
    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        await get_or_create_user(db, user_id)
        
        db_intervention = InterventionModel(
            user_id=user_id,
            name=intervention["name"],
            description=intervention.get("description"),
            start_date=intervention["start_date"],
            end_date=intervention["end_date"]
        )
        
        db.add(db_intervention)
        await db.flush()
        await db.refresh(db_intervention)
        await db.commit()
        
        return JSONResponse(content={
            "id": db_intervention.id,
            "name": db_intervention.name,
            "description": db_intervention.description,
            "start_date": db_intervention.start_date.isoformat(),
            "end_date": db_intervention.end_date.isoformat()
        })
    
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Error while creating intervention")


@router.get("/{user_id}")
async def get_interventions(user_id: str, authorization: str = Header(..., alias="Authorization"), db: AsyncSession = Depends(get_db)) -> JSONResponse:

    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        result = await db.execute(select(InterventionModel).filter(InterventionModel.user_id == user_id).order_by(InterventionModel.start_date.desc()))
        interventions = result.scalars().all()
        
        intervention_list = []
        for intervention in interventions:
            intervention_dict = {
                "id": intervention.id,
                "name": intervention.name,
                "description": intervention.description,
                "start_date": intervention.start_date.isoformat(),
                "end_date": intervention.end_date.isoformat()
            }
            intervention_list.append(intervention_dict)
        
        return JSONResponse(content={"interventions": intervention_list})
    
    except Exception:
        raise HTTPException(status_code=500, detail="Error while fetching interventions")


@router.get("/{user_id}/{intervention_id}")
async def get_intervention(user_id: str, intervention_id: int, authorization: str = Header(..., alias="Authorization"), db: AsyncSession = Depends(get_db)) -> JSONResponse:

    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        result = await db.execute(select(InterventionModel).where(InterventionModel.id == intervention_id, InterventionModel.user_id == user_id))
        intervention = result.scalar_one_or_none()
        
        if intervention is None:
            raise HTTPException(status_code=404, detail="Intervention not found")
        
        return JSONResponse(content={
            "id": intervention.id,
            "name": intervention.name,
            "description": intervention.description,
            "start_date": intervention.start_date.isoformat(),
            "end_date": intervention.end_date.isoformat()
        })
    
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error while fetching intervention")


@router.put("/{user_id}/{intervention_id}")
async def update_intervention(user_id: str, intervention_id: int, intervention: InterventionSchema, authorization: str = Header(..., alias="Authorization"), db: AsyncSession = Depends(get_db)) -> JSONResponse:

    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        result = await db.execute(select(InterventionModel).where(InterventionModel.id == intervention_id, InterventionModel.user_id == user_id))
        db_intervention = result.scalar_one_or_none()
        
        if db_intervention is None:
            raise HTTPException(status_code=404, detail="Intervention not found")
        
        db_intervention.name = intervention["name"]
        db_intervention.description = intervention.get("description")
        db_intervention.start_date = intervention["start_date"]
        db_intervention.end_date = intervention["end_date"]
        
        await db.commit()
        await db.refresh(db_intervention)
        
        return JSONResponse(content={
            "id": db_intervention.id,
            "name": db_intervention.name,
            "description": db_intervention.description,
            "start_date": db_intervention.start_date.isoformat(),
            "end_date": db_intervention.end_date.isoformat()
        })
    
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot update intervention details")


@router.delete("/{user_id}/{intervention_id}")
async def delete_intervention(user_id: str, intervention_id: int, authorization: str = Header(..., alias="Authorization"), db: AsyncSession = Depends(get_db)) -> JSONResponse:

    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        result = await db.execute(select(InterventionModel).where(InterventionModel.id == intervention_id, InterventionModel.user_id == user_id))
        intervention = result.scalar_one_or_none()
        
        if intervention is None:
            raise HTTPException(status_code=404, detail="Intervention not found")
        
        await db.execute(delete(InterventionModel).where(InterventionModel.id == intervention_id))
        await db.commit()
        
        return JSONResponse(content={"message": "Intervention deleted"})
    
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot delete intervention")