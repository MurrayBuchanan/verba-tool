from pydantic import BaseModel
from typing import List
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)

class Transcript(Base):
    __tablename__ = "transcript_features"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transcript_id = Column(Integer, nullable=False)
    number_of_turns = Column(Integer, nullable=False)
    total_duration = Column(Float, nullable=False)
    wpm_per_speaker = Column(String, nullable=True)
    mean_utterance_length = Column(String, nullable=True)

class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"
    id = Column(Integer, primary_key=True, index=True)
    transcript_feature_id = Column(Integer, ForeignKey("transcript_features.id"), nullable=False)
    duration = Column(Float, nullable=False)
    offset = Column(Float, nullable=False)
    speaker = Column(String, nullable=False)
    text = Column(String, nullable=False)

class Users(BaseModel):
    id: int
    username: str
    email: str

class Segment(BaseModel):
    duration: float
    offset: float
    speaker: str
    text: str

class TranscriptAnalysis(BaseModel):
    user_id: int
    transcript_id: int
    raw_segments: List[Segment]
    number_of_turns: int
    total_duration: float
    wpm_per_speaker: dict = {}
    mean_utterance_length: dict = {}