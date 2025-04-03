from flask_restful import Resource
from flask import request

USUARIOS = {
    1: {"nombre": "Juan", "email": "juan@mail.com", "rol": "ADMIN"},
    2: {"nombre": "Ana", "email": "ana@mail.com", "rol": "USER"},
}

class Usuario(Resource):
    def get(self, id):
        id = int(id)
        if id in USUARIOS:
            return USUARIOS[id], 200
        return {"error": "Usuario no encontrado"}, 404

    def put(self, id):
        id = int(id)
        if id in USUARIOS:
            data = request.get_json()
            USUARIOS[id].update(data)
            return {"mensaje": "Usuario actualizado", "usuario": USUARIOS[id]}, 200
        return {"error": "Usuario no encontrado"}, 404

    def delete(self, id):
        id = int(id)
        if id in USUARIOS:
           USUARIOS[id]["estado"] = "suspendido"
           return {"mensaje": "Usuario suspendido"}, 200
        return {"error": "Usuario no encontrado"}, 404



class Usuarios(Resource):
    def get(self):
        return USUARIOS, 200

    def post(self):
        data = request.get_json()
        nuevo_id = max(USUARIOS.keys(), default=0) + 1
        USUARIOS[nuevo_id] = data
        return {"mensaje": "Usuario creado", "usuario": USUARIOS[nuevo_id]}, 201
