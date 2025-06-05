from flask import request, Blueprint
from main.models import UserModel
from .. import db
from flask_jwt_extended import create_access_token

auth = Blueprint('auth', __name__, url_prefix='/auth')

@auth.route('/login', methods=['POST'])
def login():
    user = db.session.query(UserModel).filter_by(email=request.json.get("email")).first()
    if user is None or not user.validate_pass(request.json.get("password")):
        return "Usuario o contraseña inválida", 401

    access_token = create_access_token(identity=user)

    return {
        "id": user.id,
        "email": user.email,
        "access_token": access_token
    }, 200

@auth.route('/register', methods=['POST'])
def register():
    user = UserModel.from_json(request.get_json())

    exists = db.session.query(UserModel).filter_by(email=user.email).scalar() is not None
    if exists:
        return "Email duplicado", 409

    db.session.add(user)
    db.session.commit()
    return user.to_json(), 201

