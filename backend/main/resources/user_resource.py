from flask_restful import Resource
from flask import request, jsonify
from main.models import UserModel
from .. import db

#USUARIOS = {1: {"nombre": "Juan", "email": "juan@mail.com", "rol": "ADMIN"},2: {"nombre": "Ana", "email": "ana@mail.com", "rol": "USER"},}


class Usuario(Resource):
    def get(self, id):  # 👈 solo agregamos el parámetro
        usuario = db.session.query(UserModel).get(id)
        if usuario:
            return usuario.to_json(), 200
        return {"error": "Usuario no encontrado"}, 404



    def put(self, id):
        usuario = db.session.query(UserModel).get(id)
        if usuario:
            data = request.get_json()
            for key, value in data.items():
                setattr(usuario, key, value)
            db.session.commit()
            return {"mensaje": "Usuario actualizado", "usuario": usuario.to_json()}, 200
        return {"error": "Usuario no encontrado"}, 404

    def delete(self, id):
        usuario = db.session.query(UserModel).get(id)
        if usuario:
            usuario.estado = "suspendido"
            db.session.commit()
            return {
            "mensaje": "Usuario suspendido",
            "usuario": usuario.to_json()  }, 200
        return {"error": "Usuario no encontrado"}, 404




class Usuarios(Resource):
    def get(self):
        estado = request.args.get("estado")

        if estado:
            usuarios = db.session.query(UserModel).filter_by(estado=estado).all()
        else:
            usuarios = db.session.query(UserModel).all()

        return [usuario.to_json() for usuario in usuarios]

    def post(self):
        data = request.get_json()
        usuario = UserModel.from_json(data)
        db.session.add(usuario)
        db.session.commit()
        return {"mensaje": "Usuario creado", "usuario": usuario.to_json()}, 201
