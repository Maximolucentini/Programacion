from flask_restful import Resource
from flask import request
from .. import db
from main.models import OrderModel, OrderProductModel,ProductModel

#PEDIDOS = {1: {"usuario_id": 1, "producto_id": 2, "estado": "pendiente"},2: {"usuario_id": 2, "producto_id": 1, "estado": "en preparación"},}



class Pedido(Resource):
    def get(self, id):
        pedido = db.session.query(OrderModel).get(id)
        if pedido:
            return pedido.to_json_complete(), 200
        return {"error": "Pedido no encontrado"}, 404

    def put(self, id):
        pedido = db.session.query(OrderModel).get(id)
        if pedido:
            data = request.get_json()
            for key, value in data.items():
                setattr(pedido, key, value)
            db.session.commit()
            return {
                "mensaje": "Pedido actualizado",
                "pedido": pedido.to_json()
            }, 200
        return {"error": "Pedido no encontrado"}, 404

    def delete(self, id):
        pedido = db.session.query(OrderModel).get(id)
        if pedido:
            db.session.delete(pedido)
            db.session.commit()
            return {"mensaje": "Pedido eliminado"}, 200
        return {"error": "Pedido no encontrado"}, 404


class Pedidos(Resource):
    def get(self):
        pedidos = db.session.query(OrderModel).all()
        return [p.to_json() for p in pedidos], 200

    def post(self):
        data = request.get_json()

        user_id = data.get("user_id")
        status = data.get("status")
        productos = data.get("productos", [])

        
        ESTADOS_VALIDOS = ["pendiente", "en preparación", "en camino", "entregado", "cancelado"]
        if status not in ESTADOS_VALIDOS:
            return {"error": "Estado no válido"}, 400

        
        order = OrderModel(user_id=user_id, status=status, total_amount=0)
        db.session.add(order)
        db.session.flush()

        total = 0
        for producto in productos:
            product_id = producto.get("product_id")
            cantidad = producto.get("quantity", 1)

            
            product = db.session.query(ProductModel).get(product_id)
            if not product:
                return {"error": f"Producto con id {product_id} no encontrado"}, 404

            precio = product.price
            subtotal = cantidad * precio
            total += subtotal

            order_product = OrderProductModel(
                order=order,
                product_id=product_id,
                quantity=cantidad,
                subtotal=subtotal
            )
            db.session.add(order_product)

        order.total_amount = total
        db.session.commit()
        return order.to_json(), 201
