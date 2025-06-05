from flask_restful import Resource
from flask import request, jsonify
from main.models import UserModel
from .. import db
from sqlalchemy.exc import IntegrityError
from sqlalchemy import asc, desc
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from main.auth.decorators import role_required




class Usuario(Resource):
 @jwt_required(optional=True)
 def get(self, id):  
        usuario = db.session.query(UserModel).get(id)
        if not usuario:
            return {"error": "Usuario no encontrado"}, 404

        current_id = get_jwt_identity()
        if current_id == usuario.id:
            return usuario.to_json_complete(), 200
        else:
            return usuario.to_json(), 200
    
 @jwt_required()
 def put(self, id):
    usuario = db.session.query(UserModel).get(id)
    if not usuario:
        return {"error": "Usuario no encontrado"}, 404
    
    if get_jwt_identity() != usuario.id:
            return {"error": "No tenés permiso para modificar este usuario"}, 403

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


    


 @role_required(["admin", "user"])
 def delete(self, id):
        usuario = db.session.query(UserModel).get(id)
        if not usuario:
            return {"error": "Usuario no encontrado"}, 404

        rol = get_jwt().get("rol")
        if rol == "user" and usuario.id != get_jwt_identity():
            return {"error": "No tenés permiso para eliminar este usuario"}, 403

        usuario.estado = "suspendido"
        db.session.commit()
        return {"mensaje": "Usuario suspendido", "usuario": usuario.to_json()}, 200






class Usuarios(Resource):
    @role_required(roles=["admin"])
    def get(self):
        
        try:
            page = int(request.args.get("page", 1))
            per_page = int(request.args.get("per_page", 10))
        except ValueError:
            return {"error": "page y per_page deben ser enteros válidos"}, 400

        query = db.session.query(UserModel)

        
        if estado := request.args.get("estado"):
            if estado not in ["activo", "suspendido"]:
                return {"error": "El estado debe ser 'activo' o 'suspendido'"}, 400
            query = query.filter(UserModel.estado == estado)

        if name := request.args.get("name"):
            query = query.filter(UserModel.name.ilike(f"%{name}%"))

        if email := request.args.get("email"):
            query = query.filter(UserModel.email.ilike(f"%{email}%"))

        
        valid_sort_options = {
            "name_asc": asc(UserModel.name),
            "name_desc": desc(UserModel.name),
            "created_at_asc": asc(UserModel.created_at),
            "created_at_desc": desc(UserModel.created_at)
        }

        sort_by = request.args.get("sort_by")
        if sort_by:
            if sort_by not in valid_sort_options:
                return {
                    "error": f"sort_by inválido. Opciones válidas: {', '.join(valid_sort_options.keys())}"
                }, 400
            query = query.order_by(valid_sort_options[sort_by])

        
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)

        return {
            "usuarios": [u.to_json() for u in paginated.items],
            "total": paginated.total,
            "pages": paginated.pages,
            "current_page": page
        }, 200


        
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


      



