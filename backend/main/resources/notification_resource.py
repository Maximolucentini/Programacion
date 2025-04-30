from flask_restful import Resource
from flask import request
from .. import db
from main.models import NotificationModel, UserModel

class Notificacion(Resource):
    def post(self):
        data = request.get_json()

        
        user_id = data.get("user_id")
        message = data.get("message")

        if user_id is None or message is None:
            return {"error": "Faltan campos obligatorios: 'user_id' y/o 'message'."}, 400

        
        if not isinstance(user_id, int):
            return {"error": "El campo 'user_id' debe ser un número entero."}, 400

    
        usuario = db.session.query(UserModel).get(user_id)
        if not usuario:
            return {"error": f"Usuario con id {user_id} no encontrado."}, 404

        
        if not isinstance(message, str) or not message.strip():
            return {"error": "El campo 'message' debe ser un texto no vacío."}, 400

        notificacion = NotificationModel.from_json(data)
        db.session.add(notificacion)
        db.session.commit()

        return {
            "mensaje": "Notificación enviada",
            "notificacion": notificacion.to_json()
        }, 201


class NotificacionesUsuario(Resource):
    def get(self, user_id):
        notificaciones = db.session.query(NotificationModel).filter_by(user_id=user_id).all()

        if not notificaciones:
            return {
                "mensaje": "No se encontraron notificaciones",
                "notificaciones": []
            }, 200

        return {
            "user_id": user_id,
            "notificaciones": [n.to_json() for n in notificaciones]
        }, 200
