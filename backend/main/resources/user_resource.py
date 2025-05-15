from flask_restful import Resource
from flask import request, jsonify
from main.models import UserModel
from .. import db
from sqlalchemy.exc import IntegrityError
from sqlalchemy import asc, desc



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


      



