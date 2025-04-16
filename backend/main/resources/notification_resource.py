from flask_restful import Resource
from flask import request
from .. import db
from main.models import NotificationModel

class Notificacion(Resource):
    def post(self):
        data = request.get_json()
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

