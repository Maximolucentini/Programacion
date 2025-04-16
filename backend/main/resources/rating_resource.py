from flask_restful import Resource
from flask import request
from .. import db
from main.models import RatingModel

class Valoracion(Resource):
    def post(self):
        data = request.get_json()
        rating = RatingModel.from_json(data)
        db.session.add(rating)
        db.session.commit()

        return {
            "mensaje": "Valoración agregada",
            "rating": rating.to_json()
        }, 201

class ObtenerValoracion(Resource):
    def get(self, producto_id):
        ratings = db.session.query(RatingModel).filter_by(product_id=producto_id).all()

        if not ratings:
            return {
                "producto_id": producto_id,
                "valoraciones": [],
                "promedio": 0
            }, 200

        scores = [r.score for r in ratings]
        promedio = sum(scores) / len(scores)

        return {
            "producto_id": producto_id,
            "valoraciones": scores,
            "promedio": round(promedio, 2)
        }, 200

