from flask_restful import Resource
from flask import request
from .. import db
from main.models import RatingModel, UserModel, ProductModel
from sqlalchemy import asc, desc


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
        query = db.session.query(RatingModel).filter_by(product_id=producto_id)

        
        if user_id := request.args.get("user_id"):
            try:
                user_id = int(user_id)
                query = query.filter(RatingModel.user_id == user_id)
            except ValueError:
                return {"error": "user_id debe ser un número entero válido"}, 400

        try:
            if min_score := request.args.get("min_score"):
                query = query.filter(RatingModel.score >= int(min_score))
            if max_score := request.args.get("max_score"):
                query = query.filter(RatingModel.score <= int(max_score))
        except ValueError:
            return {"error": "min_score y max_score deben ser números enteros válidos"}, 400

        
        valid_sort = {
            "score_asc": asc(RatingModel.score),
            "score_desc": desc(RatingModel.score),
            "fecha_asc": asc(RatingModel.created_at),
            "fecha_desc": desc(RatingModel.created_at)
        }

        sort_by = request.args.get("sort_by")
        if sort_by:
            if sort_by not in valid_sort:
                return {"error": f"sort_by inválido. Opciones: {', '.join(valid_sort.keys())}"}, 400
            query = query.order_by(valid_sort[sort_by])

        
        ratings = query.all()

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
