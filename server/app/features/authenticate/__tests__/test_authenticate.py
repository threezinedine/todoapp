import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_verify_returns_401_when_no_authorization_header(client: AsyncClient):
    """Calling /api/auth/verify without an Authorization header returns 401."""
    response = await client.post("/api/auth/verify", json={})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_verify_returns_401_when_token_is_invalid(client: AsyncClient):
    """Calling /api/auth/verify with a wrong token returns 401."""
    response = await client.post(
        "/api/auth/verify",
        json={},
        headers={"Authorization": "Bearer wrong-token"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid authentication credentials"


@pytest.mark.asyncio
async def test_verify_returns_200_when_token_matches_default(client: AsyncClient):
    """Calling /api/auth/verify with the correct token returns 200."""
    response = await client.post(
        "/api/auth/verify",
        json={},
        headers={"Authorization": "Bearer valid-test-token"},
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Token is valid"


@pytest.mark.asyncio
async def test_verify_returns_401_for_malformed_authorization_header(client: AsyncClient):
    """Calling /api/auth/verify with a malformed header (no Bearer prefix) returns 401."""
    response = await client.post(
        "/api/auth/verify",
        json={},
        headers={"Authorization": "valid-test-token"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_verify_returns_401_for_empty_bearer_token(client: AsyncClient):
    """Calling /api/auth/verify with an empty Bearer token returns 401."""
    response = await client.post(
        "/api/auth/verify",
        json={},
        headers={"Authorization": "Bearer "},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_verify_returns_200_for_extra_bearer_spaces(client: AsyncClient):
    """HTTPBearer's default whitespace stripping accepts "Bearer  <token>" as valid."""
    response = await client.post(
        "/api/auth/verify",
        json={},
        headers={"Authorization": "Bearer  valid-test-token"},
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_verify_returns_200_for_bearer_uppercase(client: AsyncClient):
    """HTTPBearer normalizes the Bearer scheme to lowercase, so uppercase also works."""
    response = await client.post(
        "/api/auth/verify",
        json={},
        headers={"Authorization": "BEARER valid-test-token"},
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_verify_body_is_ignored(client: AsyncClient):
    """Token verification only depends on the Authorization header, not body content."""
    response = await client.post(
        "/api/auth/verify",
        json={"some": "payload"},
        headers={"Authorization": "Bearer valid-test-token"},
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_verify_works_with_empty_json_body(client: AsyncClient):
    """Even an empty JSON body is accepted when the token is valid."""
    response = await client.post(
        "/api/auth/verify",
        content=b"{}",
        headers={
            "Authorization": "Bearer valid-test-token",
            "Content-Type": "application/json",
        },
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_health_endpoint_returns_ok(client: AsyncClient):
    """The /api/health endpoint returns status ok."""
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_authenticate_router_prefix(client: AsyncClient):
    """All auth routes are under /api/auth."""
    response = await client.post(
        "/api/auth/verify",
        json={},
        headers={"Authorization": "Bearer valid-test-token"},
    )
    assert response.url.path == "/api/auth/verify"


@pytest.mark.asyncio
async def test_auth_endpoint_returns_404_for_unknown_path(client: AsyncClient):
    """Unknown auth paths return 404."""
    response = await client.get("/api/auth/unknown")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_root_path_returns_404(client: AsyncClient):
    """Root path / returns 404 since there is no route defined there."""
    response = await client.get("/")
    assert response.status_code == 404
