from flask_restful import Resource
from flask import request, jsonify
from main.models import UserModel
from .. import db
from sqlalchemy.exc import IntegrityError

#USUARIOS = {1: {"nombre": "Juan", "email": "juan@mail.com", "rol": "ADMIN"},2: {"nombre": "Ana", "email": "ana@mail.com", "rol": "USER"},}


class Usuario(Resource):
 def get(self, id):  
        usuario = db.session.query(UserModel).get(id)
        if usuario:
            return usuario.to_json(), 200
        return {"error": "Usuario no encontrado"}, 404

 def put(self, id):
    usuario = db.session.query(UserModel).get(id)
    if not usuario:
        return {"error": "Usuario no encontrado"}, 404

    data = request.get_json()

    if 'email' in data:
        nuevo_email = data['email']
        if nuevo_email != usuario.email:
            email_existente = db.session.query(UserModel).filter_by(email=nuevo_email).first()
            if email_existente:
                return {"error": "El email ya está en uso por otro usuario."}, 409

    
    for campo in ['name', 'email', 'password']:
        if campo in data:
            try:
                if not isinstance(data[campo], str):
                    return {"error": f"El campo '{campo}' debe ser texto."}, 400
                if not data[campo].strip():
                    return {"error": f"El campo '{campo}' no puede estar vacío."}, 400
            except Exception:
                return {"error": f"Error en el campo '{campo}', debe ser texto válido."}, 400

    for key, value in data.items():
        setattr(usuario, key, value)

    db.session.commit()
    return {"mensaje": "Usuario actualizado", "usuario": usuario.to_json()}, 200


    



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

    required_fields = ['name', 'email', 'password']
    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        return {"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}, 400

    
    for campo in ['name', 'email', 'password']:
        valor = data[campo]
        try:
            if not isinstance(valor, str):
                return {"error": f"El campo '{campo}' debe ser texto."}, 400
            if not valor.strip():
                return {"error": f"El campo '{campo}' no puede estar vacío."}, 400
        except Exception:
            return {"error": f"Error en el campo '{campo}', debe ser texto válido."}, 400

    usuario = UserModel.from_json(data)
    db.session.add(usuario)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "El email ya está registrado."}, 409 

    return {"mensaje": "Usuario creado", "usuario": usuario.to_json()}, 201


      



