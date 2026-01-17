from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine
from app.schemas.models import Base
from app.routers import upload, transcripts, interventions

app = FastAPI()

# CORS to allow requests from Expo Go/Dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
@app.on_event("startup")
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Endpoints
app.include_router(upload.router)
app.include_router(transcripts.router)
app.include_router(interventions.router)