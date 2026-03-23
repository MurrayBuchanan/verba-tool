from io import BytesIO
from unittest.mock import AsyncMock, MagicMock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routers.upload import router
from app.core.authentication import get_user_id
from app.core.database import get_db
from app.structures.schemas import TranscriptSegment as TranscriptSegmentSchema

app = FastAPI()
app.include_router(router)

VALID_ACCOUNT_ID = 1
INVALID_ACCOUNT_ID = 2

"""
Tests for the upload router

Run using: python -m pytest app/tests/test_upload_router.py
"""


def mock_profile_id():
    return VALID_ACCOUNT_ID


def mock_db(scalar_result=None):
    result = MagicMock()
    result.scalar_one_or_none.return_value = scalar_result

    db = AsyncMock()
    db.execute = AsyncMock(return_value=result)
    db.commit = AsyncMock()
    db.rollback = AsyncMock()
    return db