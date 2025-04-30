from flask_restful import Resource
from flask import request
from .. import db
from main.models import RatingModel, UserModel, ProductModel

class Valoracion(Resource):
    def post(self):
        data = request.get_json()

        user_id = data.get("user_id")
        product_id = data.get("product_id")
        score = data.get("score")
        comment = data.get("comment")

        if user_id is None or product_id is None or score is None:
            return {"error": "Faltan campos obligatorios: 'user_id', 'product_id' y/o 'score'."}, 400

        
        if not isinstance(user_id, int):
            return {"error": "El campo 'user_id' debe ser un número entero."}, 400
        if not isinstance(product_id, int):
            return {"error": "El campo 'product_id' debe ser un número entero."}, 400
        try:
            score = int(score)
            if not (1 <= score <= 5):
                return {"error": "El campo 'score' debe estar entre 1 y 5."}, 400
        except (ValueError, TypeError):
            return {"error": "El campo 'score' debe ser un número entero válido."}, 400

        if comment is not None:
            if not isinstance(comment, str):
                return {"error": "El campo 'comment' debe ser texto si se incluye."}, 400

        
        if not db.session.query(UserModel).get(user_id):
            return {"error": f"Usuario con id {user_id} no encontrado."}, 404
        if not db.session.query(ProductModel).get(product_id):
            return {"error": f"Producto con id {product_id} no encontrado."}, 404

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
            "valoraciones": [
                {
                    "usuario": r.user_id,
                    "score": r.score,
                    "comentario": r.comment,
                    "fecha": r.created_at.strftime('%Y-%m-%d %H:%M:%S')
                }
                for r in ratings
            ],
            "promedio": round(promedio, 2)
        }, 200