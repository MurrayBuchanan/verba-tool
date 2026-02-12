from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

class TranscriptMetadata(Base):
    __tablename__ = "transcript_metadata"
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=True)
    created_at = Column(DateTime, nullable=False)
    total_duration = Column(Float, nullable=False)

class TranscriptFeatures(Base):
    __tablename__ = "transcript_features"
    id = Column(Integer, primary_key=True, index=True)
    transcript_metadata_id = Column(Integer, ForeignKey("transcript_metadata.id"), nullable=False)
    wpm_per_speaker = Column(String, nullable=True)
    avg_word_length = Column(String, nullable=True)
    adverb_ratio = Column(String, nullable=True)
    flesch_kincaid = Column(String, nullable=True)
    prp_ratio = Column(String, nullable=True)
    num_unique_words = Column(String, nullable=True)
    impoverished_vocabulary = Column(String, nullable=True)
    word_finding_difficulties = Column(String, nullable=True)
    semantic_paraphasias = Column(String, nullable=True)
    syntactic_simplification = Column(String, nullable=True)
    discourse_impairment = Column(String, nullable=True)

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
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)