from unittest.mock import AsyncMock, MagicMock
from datetime import datetime
from fastapi import FastAPI
from fastapi.testclient import TestClient
import json

from app.routers.transcripts import router
from app.core.authentication import get_user_id
from app.core.database import get_db
from app.structures.models import TranscriptMetadata, TranscriptFeatures, TranscriptSegment

app = FastAPI()
app.include_router(router)

MOCK_ID = 1

"""
Tests for the transcripts router

Run using: python -m pytest app/tests/test_transcripts_router.py
"""

# Helpers
def mock_user_id():
    return MOCK_ID

def mock_transcript():
    return TranscriptMetadata(
        id=MOCK_ID,
        profile_id=MOCK_ID,
        total_duration=210.0,
        created_at=datetime(2026, 3, 4, 12, 0, 0)
    )

def mock_features():
    return TranscriptFeatures(
        id=MOCK_ID,
        transcript_metadata_id=MOCK_ID,
        words_per_minute=json.dumps(115.0),
        average_word_length=json.dumps(4.5),
        adverb_ratio=json.dumps(0.04),
        flesch_kincaid_grade=json.dumps(8.4),
        personal_pronoun_ratio=json.dumps(0.20),
        number_of_unique_words=json.dumps(80),
        impoverished_vocabulary=json.dumps(5),
        word_finding_difficulties=json.dumps(7),
        semantic_paraphasias=json.dumps(3),
        syntactic_simplification=json.dumps(2),
        discourse_impairment=json.dumps(2),
    )

def mock_segment():
    return TranscriptSegment(
        id=MOCK_ID,
        transcript_metadata_id=1,
        duration=64.0,
        offset=0,
        speaker="Speaker-1",
        text="Hello world!"
    )

def mock_db(scalar_result=None):
    result = MagicMock()
    result.scalar_one_or_none.return_value = scalar_result

    db = AsyncMock()
    db.execute = AsyncMock(return_value = result)
    db.commit = AsyncMock()
    db.rollback = AsyncMock()
    return db

# Testing the fetch all transcripts endpoints for status codes 200, 404, and 500
class TestGetTranscripts:
    def test_transcripts_fetch_status_code_200(self):
        transcript = mock_transcript()
        features = mock_features()

        db = AsyncMock()
        profile = MagicMock()
        profile.scalar_one_or_none.return_value = MagicMock()

        rows = MagicMock()
        rows.all.return_value = [(transcript, features)]

        db.execute = AsyncMock(side_effect=[profile, rows])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/transcripts", params={"profile_id": MOCK_ID})

        assert response.status_code == 200
        data = response.json()
        assert data["transcripts"][0]["id"] == transcript.id
        assert data["transcripts"][0]["profile_id"] == transcript.profile_id
        assert data["transcripts"][0]["total_duration"] == transcript.total_duration
        assert data["transcripts"][0]["created_at"] == transcript.created_at.isoformat()
        assert data["transcripts"][0]["words_per_minute"] == 115.0
        assert data["transcripts"][0]["average_word_length"] == 4.5
        assert data["transcripts"][0]["adverb_ratio"] == 0.04
        assert data["transcripts"][0]["flesch_kincaid_grade"] == 8.4
        assert data["transcripts"][0]["personal_pronoun_ratio"] == 0.20
        assert data["transcripts"][0]["number_of_unique_words"] == 80
        assert data["transcripts"][0]["impoverished_vocabulary"] == 5
        assert data["transcripts"][0]["word_finding_difficulties"] == 7
        assert data["transcripts"][0]["semantic_paraphasias"] == 3
        assert data["transcripts"][0]["syntactic_simplification"] == 2
        assert data["transcripts"][0]["discourse_impairment"] == 2

    def test_transcripts_fetch_status_code_404(self):
        db = mock_db(scalar_result=None)

        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/transcripts", params={"profile_id": 210})

        assert response.status_code == 404
        assert response.json()["detail"] == "Profile not found"

    def test_transcripts_fetch_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect=Exception("DB error"))
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/transcripts", params={"profile_id": MOCK_ID})

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot fetch transcripts"


# Testing the fetch transcript endpoints for status codes 200, 404, and 500
class TestGetTranscript:
    def test_transcript_fetch_status_code_200(self):
        transcript = mock_transcript()
        segment = mock_segment()

        db = AsyncMock()
        transcript_result = MagicMock()
        transcript_result.scalar_one_or_none.return_value = transcript

        segments_result = MagicMock()
        segments_scalars = MagicMock()
        segments_scalars.all.return_value = [segment]
        segments_result.scalars.return_value = segments_scalars

        db.execute = AsyncMock(side_effect=[transcript_result, segments_result])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get(f"/transcripts/{MOCK_ID}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["profile_id"] == 1
        assert data["created_at"] == datetime(2026, 3, 4, 12, 0, 0).isoformat()
        assert data["total_duration"] == 210.0
        assert data["segments"][0]["duration"] == 64.0
        assert data["segments"][0]["offset"] == 0
        assert data["segments"][0]["speaker"] == "Speaker-1"
        assert data["segments"][0]["text"] == "Hello world!"

    def test_transcript_fetch_status_code_404(self):
        db = mock_db(scalar_result=None)

        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/transcripts/210")

        assert response.status_code == 404
        assert response.json()["detail"] == "Transcript not found"

    def test_transcript_fetch_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect=Exception("DB error"))
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get(f"/transcripts/{MOCK_ID}")

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot fetch transcript"


# Testing the transcript delete endpoints for status codes 200, 404, and 500
class TestDeleteTranscript:
    def test_transcript_delete_status_code_200(self):
        transcript = mock_transcript()

        db = AsyncMock()
        transcript_result = MagicMock()
        transcript_result.scalar_one_or_none.return_value = transcript
        db.execute = AsyncMock(return_value=transcript_result)
        db.commit = AsyncMock()
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.delete(f"/transcripts/{MOCK_ID}")

        assert response.status_code == 200
        assert response.json()["message"] == "Transcript deleted"
        db.commit.assert_called_once()

    def test_transcript_delete_status_code_404(self):
        db = mock_db(scalar_result=None)

        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.delete("/transcripts/210")

        assert response.status_code == 404
        assert response.json()["detail"] == "Transcript not found"

    def test_transcript_delete_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect=Exception("DB error"))
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.delete(f"/transcripts/{MOCK_ID}")

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot delete transcript"