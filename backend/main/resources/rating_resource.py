from flask_restful import Resource
from flask import request

VALORACIONES = {}

class Valoracion(Resource):
    def post(self):
        data = request.get_json()
        producto_id = data.get("producto_id")
        if producto_id not in VALORACIONES:
            VALORACIONES[producto_id] = []
        VALORACIONES[producto_id].append(data["valor"])
        return {
            "mensaje": "Valoración agregada",
            "producto_id": producto_id,
            "valoraciones": VALORACIONES[producto_id]
        }, 201

class ObtenerValoracion(Resource):
    def get(self, producto_id):
        valores = VALORACIONES.get(producto_id, [])
        promedio = sum(valores) / len(valores) if valores else 0
        return {
            "producto_id": producto_id,
            "valoraciones": valores,
            "promedio": promedio
        }, 200
