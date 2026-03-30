from unittest.mock import AsyncMock, MagicMock
from fastapi import FastAPI
from fastapi.testclient import TestClient
from datetime import datetime

from app.routers.interventions import router
from app.core.authentication import get_user_id
from app.core.database import get_db
from app.structures.models import Intervention as InterventionModel

app = FastAPI()
app.include_router(router)

"""
Tests for the interventions router

Run using: python -m pytest app/tests/test_interventions_router.py
"""

VALID_ACCOUNT_ID = 1
INVALID_ACCOUNT_ID = 2

SAMPLE_INTERVENTION = {
    "profile_id": VALID_ACCOUNT_ID,
    "name": "Puzzle Games",
    "description": "You can play chess, by visiting chess.com",
    "goals": "Improve critical thinking and problem solving skills.",
    "success": True,
    "start_date": "2026-03-31",
    "end_date": "2026-04-02"
}

def mock_profile_id():
    return VALID_ACCOUNT_ID

def mock_intervention():
    return InterventionModel(
        id=VALID_ACCOUNT_ID,
        profile_id=VALID_ACCOUNT_ID,
        name="Puzzle Games",
        description="The folk should visit chess.com",
        goals="Improve critical thinking and problem solving skills.",
        success=True,
        start_date=datetime(2026, 3, 31),
        end_date=datetime(2026, 4, 2)
    )

def mock_db(scalar_result=None):
    result = MagicMock()
    result.scalar_one_or_none.return_value = scalar_result

    db = AsyncMock()
    db.execute = AsyncMock(return_value = result)
    db.commit = AsyncMock()
    db.rollback = AsyncMock()
    return db

class TestGetInterventions:
    def test_interventions_fetch_status_code_200(self):
        intervention = mock_intervention()

        profile_result = MagicMock()
        profile_result.scalar_one_or_none.return_value = MagicMock()

        list_result = MagicMock()
        list_scalars = MagicMock()
        list_scalars.all.return_value = [intervention]
        list_result.scalars.return_value = list_scalars

        db = AsyncMock()
        db.execute = AsyncMock(side_effect = [profile_result, list_result])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/interventions", params = {"profile_id": VALID_ACCOUNT_ID})

        assert response.status_code == 200
        data = response.json()
        assert data["interventions"][0]["id"] == intervention.id
        assert data["interventions"][0]["name"] == intervention.name
        assert data["interventions"][0]["description"] == intervention.description
        assert data["interventions"][0]["goals"] == intervention.goals
        assert data["interventions"][0]["success"] == intervention.success
        assert data["interventions"][0]["start_date"] == intervention.start_date.isoformat()
        assert data["interventions"][0]["end_date"] == intervention.end_date.isoformat()

    def test_interventions_fetch_empty_list_status_code_200(self):
        profile_result = MagicMock()
        profile_result.scalar_one_or_none.return_value = MagicMock()

        list_result = MagicMock()
        list_scalars = MagicMock()
        list_scalars.all.return_value = []
        list_result.scalars.return_value = list_scalars

        db = AsyncMock()
        db.execute = AsyncMock(side_effect=[profile_result, list_result])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/interventions", params = {"profile_id": VALID_ACCOUNT_ID})

        assert response.status_code == 200
        assert response.json() == {"interventions": []}

    def test_interventions_fetch_status_code_404_profile_not_found(self):
        profile_result = MagicMock()
        profile_result.scalar_one_or_none.return_value = None

        db = AsyncMock()
        db.execute = AsyncMock(return_value = profile_result)
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/interventions", params = {"profile_id": VALID_ACCOUNT_ID})

        assert response.status_code == 404
        assert response.json()["detail"] == "Profile not found"

    def test_interventions_fetch_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect = [Exception("DB error")])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/interventions", params = {"profile_id": VALID_ACCOUNT_ID})

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot fetch interventions"

class TestCreateIntervention:
    def test_intervention_create_status_code_500(self):
        profile_result = MagicMock()
        profile_result.scalar_one_or_none.return_value = MagicMock()

        db = AsyncMock()
        db.execute = AsyncMock(return_value = profile_result)
        db.add = MagicMock(side_effect = [Exception("DB error")])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.post("/interventions", json = SAMPLE_INTERVENTION)

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot create intervention"

class TestUpdateIntervention:
    def test_intervention_update_status_code_200(self):
        intervention = mock_intervention()
        update_json = {
            **SAMPLE_INTERVENTION,
            "name": "Jane Doe",
            "description": "Updated description"
        }

        intervention_result = MagicMock()
        intervention_result.scalar_one_or_none.return_value = intervention
        profile_result = MagicMock()
        profile_result.scalar_one_or_none.return_value = MagicMock()

        db = AsyncMock()
        db.execute = AsyncMock(side_effect = [intervention_result, profile_result])
        db.commit = AsyncMock()
        db.refresh = AsyncMock()
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.put(f"/interventions/{VALID_ACCOUNT_ID}", json = update_json)

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == intervention.id
        assert data["profile_id"] == update_json["profile_id"]
        assert data["name"] == update_json["name"]
        assert data["description"] == update_json["description"]
        assert data["goals"] == update_json["goals"]
        assert data["success"] == update_json["success"]
        assert data["start_date"] == update_json["start_date"]
        assert data["end_date"] == update_json["end_date"]
        assert intervention.name == update_json["name"]
        assert intervention.description == update_json["description"]
        db.commit.assert_called_once()

    def test_intervention_update_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect = [Exception("DB error")])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.put(f"/interventions/{VALID_ACCOUNT_ID}", json = SAMPLE_INTERVENTION)

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot update intervention"

class TestGetIntervention:
    def test_intervention_fetch_status_code_200(self):
        intervention = mock_intervention()

        db = AsyncMock()
        intervention_result = MagicMock()
        intervention_result.scalar_one_or_none.return_value = intervention

        db.execute = AsyncMock(return_value = intervention_result)
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get(f"/interventions/{VALID_ACCOUNT_ID}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == intervention.id
        assert data["name"] == intervention.name
        assert data["description"] == intervention.description

    def test_intervention_fetch_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect = [Exception("DB error")])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get(f"/interventions/{VALID_ACCOUNT_ID}")

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot fetch intervention"

class TestDeleteIntervention:
    def test_intervention_delete_status_code_200(self):
        intervention = mock_intervention()

        db = AsyncMock()
        intervention_result = MagicMock()
        intervention_result.scalar_one_or_none.return_value = intervention
        db.execute = AsyncMock(return_value = intervention_result)
        db.commit = AsyncMock()
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.delete(f"/interventions/{VALID_ACCOUNT_ID}")

        assert response.status_code == 200
        assert response.json()["message"] == "Intervention deleted"
        db.commit.assert_called_once()

    def test_intervention_delete_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect = [Exception("DB error")])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.delete(f"/interventions/{VALID_ACCOUNT_ID}")

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot delete intervention"