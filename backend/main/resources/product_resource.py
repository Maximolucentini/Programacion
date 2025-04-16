from flask_restful import Resource
from flask import request
from .. import db
from main.models import ProductModel

#PRODUCTOS = {1: {"nombre": "Hamburguesa Clásica"},2: {"nombre": "Hamburguesa Doble"},3: {"nombre": "Hamburguesa con Bacon"},}


class Producto(Resource):
    def get(self, id):
        producto = db.session.query(ProductModel).get(id)
        if producto:
            return producto.to_json(), 200
        return {"error": "Producto no encontrado"}, 404

    def put(self, id):
        producto = db.session.query(ProductModel).get(id)
        if producto:
            data = request.get_json()
            for key, value in data.items():
                setattr(producto, key, value)
            db.session.commit()
            return {
                "mensaje": "Producto actualizado",
                "producto": producto.to_json()
            }, 200
        return {"error": "Producto no encontrado"}, 404

    def delete(self, id):
        producto = db.session.query(ProductModel).get(id)
        if producto:
            producto.estado = "suspendido"  
            db.session.commit()
            return {
                "mensaje": "Producto suspendido",
                "producto": producto.to_json()
            }, 200
        return {"error": "Producto no encontrado"}, 404


class Productos(Resource):
    def get(self):
        estado = request.args.get("estado")  # permite ?estado=activo o suspendido

        if estado:
            productos = db.session.query(ProductModel).filter_by(estado=estado).all()
        else:
            productos = db.session.query(ProductModel).all()

        return [p.to_json() for p in productos], 200

    def post(self):
        data = request.get_json()
        producto = ProductModel.from_json(data)
        db.session.add(producto)
        db.session.commit()
        return {
            "mensaje": "Producto creado",
            "producto": producto.to_json()
        }, 201
