from flask import request, Blueprint
from main.models import UserModel
from .. import db
from flask_jwt_extended import create_access_token
from main.mail.functions import sendMail

auth = Blueprint('auth', __name__, url_prefix='/auth')

@auth.route('/login', methods=['POST'])
def login():
    user = db.session.query(UserModel).filter_by(email=request.json.get("email")).first()
    if user is None or not user.validate_pass(request.json.get("password")):
        return {"message":"Usuario o contraseña inválida"}, 401
    
    if user.estado == "pre_confirmacion":
        return {"message": "Cuenta pendiente de validación por el local."}, 403


    access_token = create_access_token(identity=user)

    return {
        "id": user.id,
        "email": user.email,
        "access_token": access_token
    }, 200

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}

    
    phone = (data.get("phone") or "").strip()
    if not phone:
        return {"message": "El teléfono es obligatorio para registrarse"}, 400

    user = UserModel.from_json(data)
    user.phone = phone  
    
    user.estado = "pre_confirmacion"
    user.rol = "user"


    exists = db.session.query(UserModel).filter_by(email=user.email).scalar() is not None
    if exists:
        return {"message": "Email duplicado"}, 409

    try:
        db.session.add(user)
        db.session.commit()

        
        sendMail(
            [user.email],
            "¡Bienvenido/a a la Rotisería!",
            "register",
            user=user
        )

        return user.to_json(), 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400


