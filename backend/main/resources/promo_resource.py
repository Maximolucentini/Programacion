from flask import request
from flask_restful import Resource
from datetime import datetime

from main import db
from main.models.promo_model import Promotion
from main.models.user import User
from main.mail.functions import sendMail     



from flask_jwt_extended import jwt_required, get_jwt


def admin_only():
    claims = get_jwt() or {}
    rol = claims.get("rol")
    return rol == "admin"


class PromocionesResource(Resource):
    @jwt_required(optional=True)
    def get(self):
        
        # Filtros opcionales
        estado = request.args.get("estado")
        order = request.args.get("order", "desc").lower()

        query = Promotion.query
        if estado in ("activa", "suspendida"):
            query = query.filter_by(estado=estado)

        if order == "asc":
            query = query.order_by(Promotion.fecha.asc())
        else:
            query = query.order_by(Promotion.fecha.desc())

        promos = query.all()
        return [p.to_json() for p in promos], 200

    @jwt_required()
    def post(self):
        # Solo admin crea promos
        if not admin_only():
            return {"message": "No autorizado"}, 403

        data = request.get_json() or {}

        title = (data.get("title") or "").strip()
        description = (data.get("description") or "").strip()
        estado = (data.get("estado") or "activa").strip().lower()
        raw_fecha = data.get("fecha")

        if not title:
            return {"message": "El título es obligatorio"}, 400
        if not description:
            return {"message": "La descripción es obligatoria"}, 400
        if estado not in ("activa", "suspendida"):
            return {"message": "Estado inválido (activa | suspendida)"}, 400

        try:
            fecha = datetime.strptime(raw_fecha, "%Y-%m-%d").date()
        except Exception:
            return {"message": "Fecha inválida. Use YYYY-MM-DD"}, 400

        promo = Promotion(
            title=title,
            description=description,
            fecha=fecha,
            estado=estado,
        )

        try:
            db.session.add(promo)
            db.session.commit()
            return promo.to_json(), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500


class PromocionResource(Resource):
    @jwt_required(optional=True)
    def get(self, id):
        promo = Promotion.query.get_or_404(id)
        return promo.to_json(), 200

    @jwt_required()
    def put(self, id):
        if not admin_only():
            return {"message": "No autorizado"}, 403

        promo = Promotion.query.get_or_404(id)
        data = request.get_json() or {}

        if "title" in data:
            title = (data.get("title") or "").strip()
            if not title:
                return {"message": "El título no puede estar vacío"}, 400
            promo.title = title

        if "description" in data:
            description = (data.get("description") or "").strip()
            if not description:
                return {"message": "La descripción no puede estar vacía"}, 400
            promo.description = description

        if "estado" in data:
            estado = (data.get("estado") or "").strip().lower()
            if estado not in ("activa", "suspendida"):
                return {"message": "Estado inválido (activa | suspendida)"}, 400
            promo.estado = estado

        if "fecha" in data:
            raw_fecha = data.get("fecha")
            try:
                promo.fecha = datetime.strptime(raw_fecha, "%Y-%m-%d").date()
            except Exception:
                return {"message": "Fecha inválida. Use YYYY-MM-DD"}, 400

        try:
            db.session.commit()
            return promo.to_json(), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    @jwt_required()
    def delete(self, id):
        if not admin_only():
            return {"message": "No autorizado"}, 403

        promo = Promotion.query.get_or_404(id)

        try:
            db.session.delete(promo)
            db.session.commit()
            return {"message": "Promoción eliminada"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        
class PromocionEnviarResource(Resource):
    @jwt_required()
    def post(self, id):
        if not admin_only():
            return {"message": "No autorizado"}, 403
        
        #if promo.enviada:
        #return {"message": "Esta promoción ya fue enviada"}, 400


        promo = Promotion.query.get_or_404(id)

        #evitar envío de suspendidas:
        if promo.estado != "activa":
            return {"message": "La promoción está suspendida"}, 400

        # clientes habilitados
        clientes = User.query.filter(
            User.rol == "user",
            User.estado == "activo"    
        ).all()

        emails = [c.email for c in clientes if c.email]

        if not emails:
            return {"message": "No hay clientes activos para notificar"}, 400

        try:
            
            sendMail(
                emails,
                f"Nueva promoción: {promo.title}",
                "promo",          
                promo=promo
            )

            promo.enviada = True
            promo.sent_at = datetime.utcnow()
            db.session.commit()

            return promo.to_json(), 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
