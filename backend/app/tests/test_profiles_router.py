from unittest.mock import AsyncMock, MagicMock
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routers.profiles import router
from app.core.authentication import get_user_id
from app.core.database import get_db
from app.structures.models import Profile as ProfileModel

app = FastAPI()
app.include_router(router)

"""
Tests for the profiles router

Run using: python -m pytest app/tests/test_profiles_router.py
"""

VALID_ACCOUNT_ID = 1
INVALID_ACCOUNT_ID = 2

SAMPLE_PROFILE = {"name": "John Doe", "description": "This is a test profile."}

def mock_profile_id():
    return VALID_ACCOUNT_ID

def mock_profile():
    return ProfileModel(
        id=VALID_ACCOUNT_ID,
        user_id=VALID_ACCOUNT_ID,
        name=SAMPLE_PROFILE["name"],
        description=SAMPLE_PROFILE["description"],
    )

def mock_db(scalar_result=None):
    result = MagicMock()
    result.scalar_one_or_none.return_value = scalar_result

    db = AsyncMock()
    db.execute = AsyncMock(return_value = result)
    db.commit = AsyncMock()
    db.rollback = AsyncMock()
    return db

class TestGetProfiles:
    def test_profiles_fetch_status_code_200(self):
        profile = mock_profile()

        db = AsyncMock()
        list_result = MagicMock()
        list_scalars = MagicMock()
        list_scalars.all.return_value = [profile]
        list_result.scalars.return_value = list_scalars
        db.execute = AsyncMock(return_value=list_result)
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/profiles")

        assert response.status_code == 200
        data = response.json()
        assert data["profiles"][0]["id"] == profile.id
        assert data["profiles"][0]["name"] == profile.name
        assert data["profiles"][0]["description"] == profile.description

    def test_profiles_fetch_empty_list_status_code_200(self):
        db = AsyncMock()
        list_result = MagicMock()
        list_scalars = MagicMock()
        list_scalars.all.return_value = []
        list_result.scalars.return_value = list_scalars
        db.execute = AsyncMock(return_value=list_result)
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/profiles")

        assert response.status_code == 200
        assert response.json() == {"profiles": []}

    def test_profiles_fetch_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect = [Exception("DB error")])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get("/profiles")

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot fetch profiles"

class TestCreateProfile:
    def test_profile_create_status_code_200(self):
        created = []

        def capture_add(obj):
            created.append(obj)

        async def flush_set_id():
            if created:
                created[0].id = VALID_ACCOUNT_ID

        db = AsyncMock()
        db.add = MagicMock(side_effect=capture_add)
        db.flush = AsyncMock(side_effect=flush_set_id)
        db.refresh = AsyncMock()
        db.commit = AsyncMock()
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.post("/profiles", json=SAMPLE_PROFILE)

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == VALID_ACCOUNT_ID
        assert data["name"] == SAMPLE_PROFILE["name"]
        assert data["description"] == SAMPLE_PROFILE["description"]
        db.add.assert_called_once()
        db.commit.assert_called_once()

    def test_profile_create_status_code_500(self):
        db = AsyncMock()
        db.add = MagicMock(side_effect = [Exception("DB error")])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.post("/profiles", json=SAMPLE_PROFILE)

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot create profile"

class TestUpdateProfile:
    def test_profile_update_status_code_200(self):
        profile = mock_profile()
        update_json = {"name": "Jane Doe", "description": "Updated description"}

        db = AsyncMock()
        profile_result = MagicMock()
        profile_result.scalar_one_or_none.return_value = profile

        db.execute = AsyncMock(return_value=profile_result)
        db.commit = AsyncMock()
        db.refresh = AsyncMock()
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.put(f"/profiles/{VALID_ACCOUNT_ID}", json=update_json)

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == profile.id
        assert data["name"] == update_json["name"]
        assert data["description"] == update_json["description"]
        assert profile.name == update_json["name"]
        assert profile.description == update_json["description"]
        db.commit.assert_called_once()

    def test_profile_update_status_code_404(self):
        db = mock_db(scalar_result=None)

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.put(f"/profiles/{INVALID_ACCOUNT_ID}", json=SAMPLE_PROFILE)

        assert response.status_code == 404
        assert response.json()["detail"] == "Profile not found"

    def test_profile_update_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect = [Exception("DB error")])
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.put(f"/profiles/{VALID_ACCOUNT_ID}", json=SAMPLE_PROFILE)

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot update profile"

class TestGetProfile:
    def test_profile_fetch_status_code_200(self):
        profile = mock_profile()

        db = AsyncMock()
        profile_result = MagicMock()
        profile_result.scalar_one_or_none.return_value = profile

        db.execute = AsyncMock(return_value=profile_result)
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get(f"/profiles/{VALID_ACCOUNT_ID}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == profile.id
        assert data["name"] == profile.name
        assert data["description"] == profile.description

    def test_profile_fetch_status_code_404(self):
        db = mock_db(scalar_result=None)

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get(f"/profiles/{INVALID_ACCOUNT_ID}")

        assert response.status_code == 404
        assert response.json()["detail"] == "Profile not found"

    def test_profile_fetch_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect=Exception("DB error"))
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.get(f"/profiles/{VALID_ACCOUNT_ID}")

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot get profile"

class TestDeleteProfile:
    def test_profile_delete_status_code_200(self):
        profile = mock_profile()

        db = AsyncMock()
        profile_result = MagicMock()
        profile_result.scalar_one_or_none.return_value = profile
        db.execute = AsyncMock(return_value=profile_result)
        db.commit = AsyncMock()
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.delete(f"/profiles/{VALID_ACCOUNT_ID}")

        assert response.status_code == 200
        assert response.json()["message"] == "Profile deleted"
        db.commit.assert_called_once()

    def test_profile_delete_status_code_404(self):
        db = mock_db(scalar_result=None)

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.delete(f"/profiles/{INVALID_ACCOUNT_ID}")

        assert response.status_code == 404
        assert response.json()["detail"] == "Profile not found"

    def test_profile_delete_status_code_500(self):
        db = AsyncMock()
        db.execute = AsyncMock(side_effect=Exception("DB error"))
        db.rollback = AsyncMock()

        app.dependency_overrides[get_user_id] = mock_profile_id
        app.dependency_overrides[get_db] = lambda: db

        client = TestClient(app)
        response = client.delete(f"/profiles/{VALID_ACCOUNT_ID}")

        assert response.status_code == 500
        assert response.json()["detail"] == "Cannot delete profile"