from flask_restful import Resource
from flask import request

NOTIFICACIONES = []

class Notificacion(Resource):
    def post(self):
        data = request.get_json()
        NOTIFICACIONES.append(data)
        return {
            "mensaje": "Notificación enviada",
            "notificacion": data
        }, 201
