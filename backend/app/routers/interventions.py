from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import API_TOKEN
from app.core.database import get_db
from app.schemas.models import Intervention as InterventionModel
from app.schemas.schemas import Intervention as InterventionSchema

router = APIRouter(prefix="/interventions", tags=["interventions"])


@router.post("")
async def create_intervention(intervention: InterventionSchema, authorization: str = Header(..., alias="Authorization"), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    # Verify API token
    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        db_intervention = InterventionModel(
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


@router.get("")
async def get_interventions(authorization: str = Header(..., alias="Authorization"), db: AsyncSession = Depends(get_db)) -> JSONResponse:

    # Verify API token
    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        result = await db.execute(select(InterventionModel).order_by(InterventionModel.start_date.desc()))
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


@router.get("/{intervention_id}")
async def get_intervention(intervention_id: int, authorization: str = Header(..., alias="Authorization"), db: AsyncSession = Depends(get_db)) -> JSONResponse:
    # Verify API token
    if authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        result = await db.execute(select(InterventionModel).where(InterventionModel.id == intervention_id))
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
