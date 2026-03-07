from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, Boolean, Text
from app.core.database import Base

"""
Database models/tables
"""

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)

class TranscriptMetadata(Base):
    __tablename__ = "transcript_metadata"
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"))
    created_at = Column(DateTime, nullable=False)
    total_duration = Column(Float, nullable=False)

class TranscriptFeatures(Base):
    __tablename__ = "transcript_features"
    id = Column(Integer, primary_key=True, index=True)
    transcript_metadata_id = Column(Integer, ForeignKey("transcript_metadata.id"), nullable=False)
    words_per_minute = Column(String, nullable=False)
    average_word_length = Column(String, nullable=False)
    adverb_ratio = Column(String, nullable=False)
    flesch_kincaid_grade = Column(String, nullable=False)
    personal_pronoun_ratio = Column(String, nullable=False)
    number_of_unique_words = Column(String, nullable=False)
    impoverished_vocabulary = Column(String, nullable=False)
    word_finding_difficulties = Column(String, nullable=False)
    semantic_paraphasias = Column(String, nullable=False)
    syntactic_simplification = Column(String, nullable=False)
    discourse_impairment = Column(String, nullable=False)

class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"
    id = Column(Integer, primary_key=True, index=True)
    transcript_metadata_id = Column(Integer, ForeignKey("transcript_metadata.id"), nullable=False)
    duration = Column(Float, nullable=False)
    offset = Column(Float, nullable=False)
    speaker = Column(String, nullable=False)
    text = Column(String, nullable=False)

class Intervention(Base):
    __tablename__ = "interventions"
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"))
    name = Column(String, nullable=False)
    description = Column(String)
    goals = Column(String)
    success = Column(Boolean, default=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)