from flask_restful import Resource
from flask import request


SESIÓN_ACTIVA = {
    "usuario_id": None,
    "rol": None,
    "token": None  
}

class Login(Resource):
    def post(self):
        data = request.get_json()
        usuario_id = data.get("usuario_id")
        rol = data.get("rol")

        
        SESIÓN_ACTIVA["usuario_id"] = usuario_id
        SESIÓN_ACTIVA["rol"] = rol
        SESIÓN_ACTIVA["token"] = "token_simulado"

        return {
            "mensaje": "Login exitoso",
            "sesion": SESIÓN_ACTIVA
        }, 200


class Logout(Resource):
    def post(self):
        SESIÓN_ACTIVA["usuario_id"] = None
        SESIÓN_ACTIVA["rol"] = None
        SESIÓN_ACTIVA["token"] = None

        return {"mensaje": "Logout exitoso"}, 200
