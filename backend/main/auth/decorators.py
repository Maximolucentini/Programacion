from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps
from .. import jwt

def role_required(roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims['rol'] in roles:
                return fn(*args, **kwargs)
            return {"message":'Acceso denegado por rol'}, 403
        return wrapper
    return decorator

@jwt.user_identity_loader
def user_identity_lookup(user):
    return str(user.id)

@jwt.additional_claims_loader
def add_claims_to_access_token(user):
    return {
        'rol': user.rol,
        'id': user.id,
        'email': user.email
    }


