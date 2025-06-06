from flask_restful import Resource
from flask import request
from .. import db
from main.models import NotificationModel, UserModel
from sqlalchemy import asc, desc
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from main.auth.decorators import role_required



class Notificacion(Resource):
    @role_required(roles=["admin"])
    def post(self):
        data = request.get_json()

        
        user_id = data.get("user_id")
        message = data.get("message")

        if user_id is None or message is None:
            return {"message": "Faltan campos obligatorios: 'user_id' y/o 'message'."}, 400

        
        if not isinstance(user_id, int):
            return {"message": "El campo 'user_id' debe ser un número entero."}, 400

    
        usuario = db.session.query(UserModel).get(user_id)
        if not usuario:
            return {"message": f"Usuario con id {user_id} no encontrado."}, 404

        
        if not isinstance(message, str) or not message.strip():
            return {"message": "El campo 'message' debe ser un texto no vacío."}, 400

        notificacion = NotificationModel.from_json(data)
        db.session.add(notificacion)
        db.session.commit()

        return {
            "message": "Notificación enviada",
            "notificacion": notificacion.to_json()
        }, 201



class NotificacionesUsuario(Resource):
    @jwt_required()
    def get(self, user_id):
        rol = get_jwt().get("rol")
        current_user = get_jwt_identity()

        if rol != "admin" and current_user != user_id:
            return {"message": "No tienes permiso para ver estas notificaciones"}, 403
        
        query = db.session.query(NotificationModel).filter_by(user_id=user_id)

        
        if is_read := request.args.get("is_read"):
            if is_read.lower() not in ["true", "false"]:
                return {"message": "is_read debe ser 'true' o 'false'"}, 400
            query = query.filter(NotificationModel.is_read == (is_read.lower() == "true"))

        if contains := request.args.get("contains"):
            query = query.filter(NotificationModel.message.ilike(f"%{contains}%"))

        
        sort_by = request.args.get("sort_by")
        if sort_by:
            if sort_by == "fecha_asc":
                query = query.order_by(asc(NotificationModel.created_at))
            elif sort_by == "fecha_desc":
                query = query.order_by(desc(NotificationModel.created_at))
            else:
                return {"message": "sort_by inválido. Usá 'fecha_asc' o 'fecha_desc'"}, 400

        notificaciones = query.all()

        if not notificaciones:
            return {
                "message": "No se encontraron notificaciones",
                "notificaciones": []
            }, 200

        return {
            "user_id": user_id,
            "notificaciones": [n.to_json() for n in notificaciones]
        }, 200

