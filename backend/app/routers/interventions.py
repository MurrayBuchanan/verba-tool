from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import get_db
from app.core.authentication import get_user_id
from app.schemas.models import Intervention as InterventionModel, Profile
from app.schemas.schemas import Intervention as InterventionSchema

router = APIRouter(prefix="/interventions", tags=["interventions"])

@router.post("")
async def create_intervention(intervention: InterventionSchema, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        # Authenticate profile
        profile = (await db.execute(select(Profile).where(Profile.id == intervention.profile_id, Profile.user_id == user_id))).scalar_one_or_none()
        if profile is None:
            raise HTTPException(status_code=404, detail="User profile does not exist")

        db_intervention = InterventionModel(
            profile_id=intervention.profile_id,
            name=intervention.name,
            description=intervention.description,
            start_date=intervention.start_date,
            end_date=intervention.end_date
        )
        
        db.add(db_intervention)
        await db.flush()
        await db.refresh(db_intervention)
        await db.commit()
        
        return JSONResponse(content={
            "id": db_intervention.id,
            "profile_id": db_intervention.profile_id,
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


@router.get("")
async def get_interventions(user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db), profile_id: int = Query(...)) -> JSONResponse:
    try:
        result = await db.execute(select(Profile).where(Profile.id == profile_id, Profile.user_id == user_id))
        profile = result.scalar_one_or_none()
        if profile is None:
            raise HTTPException(status_code=404, detail="User profile not found")
        result = await db.execute(select(InterventionModel).filter(InterventionModel.profile_id == profile_id).order_by(InterventionModel.start_date.desc()))
        interventions = result.scalars().all()
        
        intervention_list = []
        for intervention in interventions:
            intervention_list.append({
                "id": intervention.id,
                "profile_id": intervention.profile_id,
                "name": intervention.name,
                "description": intervention.description,
                "start_date": intervention.start_date.isoformat(),
                "end_date": intervention.end_date.isoformat(),
            })
        
        return JSONResponse(content={"interventions": intervention_list})
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Error while fetching interventions")


@router.get("/{intervention_id}")
async def get_intervention(intervention_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(InterventionModel).join(Profile, InterventionModel.profile_id == Profile.id).where(InterventionModel.id == intervention_id, Profile.user_id == user_id))
        intervention = result.scalar_one_or_none()
        
        if intervention is None:
            raise HTTPException(status_code=404, detail="Intervention not found")
        
        return JSONResponse(content={
            "id": intervention.id,
            "profile_id": intervention.profile_id,
            "name": intervention.name,
            "description": intervention.description,
            "start_date": intervention.start_date.isoformat(),
            "end_date": intervention.end_date.isoformat(),
        })
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error while fetching intervention")


@router.put("/{intervention_id}")
async def update_intervention(intervention_id: int, intervention: InterventionSchema, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(InterventionModel).join(Profile, InterventionModel.profile_id == Profile.id).where(InterventionModel.id == intervention_id, Profile.user_id == user_id))
        db_intervention = result.scalar_one_or_none()
        if db_intervention is None:
            raise HTTPException(status_code=404, detail="Intervention not found")
        profile = (await db.execute(select(Profile).where(Profile.id == intervention.profile_id, Profile.user_id == user_id))).scalar_one_or_none()
        if profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        db_intervention.profile_id = intervention.profile_id
        db_intervention.name = intervention.name
        db_intervention.description = intervention.description
        db_intervention.start_date = intervention.start_date
        db_intervention.end_date = intervention.end_date
        
        await db.commit()
        await db.refresh(db_intervention)
        return JSONResponse(content={
            "id": db_intervention.id,
            "profile_id": db_intervention.profile_id,
            "name": db_intervention.name,
            "description": db_intervention.description,
            "start_date": db_intervention.start_date.isoformat(),
            "end_date": db_intervention.end_date.isoformat(),
        })
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot update intervention details")


@router.delete("/{intervention_id}")
async def delete_intervention(intervention_id: int, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    try:
        result = await db.execute(select(InterventionModel).join(Profile, InterventionModel.profile_id == Profile.id).where(InterventionModel.id == intervention_id, Profile.user_id == user_id))
        intervention = result.scalar_one_or_none()
        
        if intervention is None:
            raise HTTPException(status_code=404, detail="Intervention not found")
        
        await db.execute(delete(InterventionModel).where(InterventionModel.id == intervention_id))
        await db.commit()
        
        return JSONResponse(content={"message": "Intervention deleted"})
    
    except HTTPException:
        raise
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Cannot delete intervention")