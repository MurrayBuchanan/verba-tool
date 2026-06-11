import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.database import engine
from app.core.config import UPLOADS_ROOT
from app.structures.models import Base
from app.routers import upload, transcripts, interventions, profiles, account

app = FastAPI()

os.makedirs(UPLOADS_ROOT, exist_ok=True)
app.mount("/static", StaticFiles(directory=UPLOADS_ROOT), name="static")

# CORS to allow requests from Expo Client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Restrict if productionised
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
app.include_router(profiles.router)
app.include_router(account.router)