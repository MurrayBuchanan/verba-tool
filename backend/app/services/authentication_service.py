from typing import Dict, Optional, Any
from fastapi import HTTPException
from jwt import decode as jwt_decode, get_unverified_header
from jwt.algorithms import RSAAlgorithm
import httpx

# Entra documentation: https://learn.microsoft.com/en-gb/entra/identity-platform/access-tokens
# Pyjwt documentation: https://pyjwt.readthedocs.io/en/stable/

class AuthenticationService:
    def __init__(self):
        self.jwks: Optional[Dict[str, Any]] = None
    
    async def validate_token(self, token: str) -> Dict[str, Any]:
        if not token:
            raise HTTPException(status_code=401, detail="Missing token")
        
        try:
            # Decode token to extract issuer and audience
            unverified_claims = jwt_decode(token, options={"verify_signature": False})
            issuer = unverified_claims.get('iss')
            audience = unverified_claims.get('aud')
            
            # Construct JWKS endpoint URL from issuer
            jwks_endpoint = issuer.replace('/v2.0', '/discovery/v2.0/keys')
            
            # Fetch JWKS if not cached
            if not self.jwks:
                async with httpx.AsyncClient() as client:
                    response = await client.get(jwks_endpoint, timeout=10.0)
                    response.raise_for_status()
                    self.jwks = response.json()
            
            # Get signing key from JWKS
            header = get_unverified_header(token)
            key_id = header.get("kid")
            
            signing_key = None
            for jwk in self.jwks.get("keys", []):
                if jwk.get("kid") == key_id:
                    signing_key = RSAAlgorithm.from_jwk(jwk)
                    break
            
            # Validate and decode token
            return jwt_decode(
                token,
                signing_key,
                algorithms=["RS256"],
                audience=audience if audience else None,
                issuer=issuer,
                options={
                    "verify_signature": True,
                    "verify_exp": True,
                    "verify_aud": bool(audience),
                    "verify_iss": True
                }
            )
            
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=401, detail="Token validation failed")