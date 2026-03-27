from io import BytesIO
from unittest.mock import AsyncMock, MagicMock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routers.upload import router
from app.core.authentication import get_user_id
from app.core.database import get_db
from app.structures.schemas import Transcript
from app.structures.schemas import TranscriptSegment as TranscriptSegmentSchema

app = FastAPI()
app.include_router(router)

VALID_ACCOUNT_ID = 1
INVALID_ACCOUNT_ID = 2

"""
Tests for the upload router

Run using: python -m pytest app/tests/test_upload_router.py
"""


def mock_user_id():
    return str(VALID_ACCOUNT_ID)


def mock_db(scalar_result=None):
    result = MagicMock()
    result.scalar_one_or_none.return_value = scalar_result or MagicMock(id=VALID_ACCOUNT_ID)

    db = AsyncMock()
    db.execute = AsyncMock(return_value=result)
    db.add = MagicMock()
    db.flush = AsyncMock(side_effect=[None, None])
    db.commit = AsyncMock()
    db.rollback = AsyncMock()
    return db


class TestUploadAudio:
    def test_upload_audio_success_status_code_200(self):
        db = mock_db()
        segment = TranscriptSegmentSchema(
            speaker="Speaker-1",
            text="Hello world",
            duration=1.5,
            offset=0.0
        )
        analytics = Transcript(
            words_per_minute={"Speaker-1": 120.0},
            average_word_length={"Speaker-1": 4.2},
            adverb_ratio={"Speaker-1": 0.1},
            flesch_kincaid_grade={"Speaker-1": 7.0},
            personal_pronoun_ratio={"Speaker-1": 0.2},
            number_of_unique_words={"Speaker-1": 15},
            impoverished_vocabulary={"Speaker-1": 0},
            word_finding_difficulties={"Speaker-1": 0},
            semantic_paraphasias={"Speaker-1": 0},
            syntactic_simplification={"Speaker-1": 0},
            discourse_impairment={"Speaker-1": 0},
            total_duration=1.5,
            raw_segments=[segment]
        )

        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        with patch("app.routers.upload.audio_converter") as mock_audio_converter, patch("app.routers.upload.speech_service") as mock_speech_service, patch("app.routers.upload.conversation_analytics") as mock_analytics, patch("app.routers.upload.check_quality_gate", return_value = None):
            mock_audio_converter.convert_to_wav.return_value = None
            mock_speech_service.diarise_audio.return_value = [segment]
            mock_analytics.analyse.return_value = analytics

            client = TestClient(app)
            response = client.post(
                "/upload",
                files = {"file": ("sample.m4a", BytesIO(b"audio-data"), "audio/m4a")},
                headers = {"Created-At": "2026-03-01T12:00:00Z", "Profile-Id": mock_user_id()}
            )

        assert response.status_code == 200
        data = response.json()
        assert data["total_duration"] == 1.5
        assert data["words_per_minute"]["Speaker-1"] == 120.0
        db.commit.assert_awaited_once()
        db.rollback.assert_not_awaited()

    def test_upload_audio_failed_status_code_500(self):
        db = mock_db()
        app.dependency_overrides[get_user_id] = mock_user_id
        app.dependency_overrides[get_db] = lambda: db

        with patch(
            "app.routers.upload.audio_converter.convert_to_wav",
            side_effect = [Exception("Conversion failed")]
        ):
            client = TestClient(app)
            response = client.post(
                "/upload",
                files = {"file": ("sample.m4a", BytesIO(b"audio-data"), "audio/m4a")},
                headers = {"Created-At": "2026-03-01T12:00:00Z", "Profile-Id": mock_user_id()}
            )

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot process audio"
        db.rollback.assert_awaited_once()