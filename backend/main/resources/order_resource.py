from flask_restful import Resource
from flask import request
from .. import db
from main.models import OrderModel, OrderProductModel,ProductModel,UserModel

#PEDIDOS = {1: {"usuario_id": 1, "producto_id": 2, "estado": "pendiente"},2: {"usuario_id": 2, "producto_id": 1, "estado": "en preparación"},}



ESTADOS_VALIDOS = ["pendiente", "en preparación", "en camino", "entregado", "cancelado"]

class Pedido(Resource):
    def get(self, id):
        pedido = db.session.query(OrderModel).get(id)
        if pedido:
            return pedido.to_json_complete(), 200
        return {"error": "Pedido no encontrado"}, 404

    def put(self, id):
        pedido = db.session.query(OrderModel).get(id)
        if not pedido:
            return {"error": "Pedido no encontrado"}, 404

        data = request.get_json()
        nuevo_estado = data.get("status")

        if not nuevo_estado:
            return {"error": "Debes especificar el nuevo estado del pedido."}, 400

        if nuevo_estado not in ESTADOS_VALIDOS:
            return {"error": "Estado no válido"}, 400

        pedido.status = nuevo_estado
        db.session.commit()
        return {
            "mensaje": "Estado del pedido actualizado",
            "pedido": pedido.to_json()
        }, 200

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

        if not isinstance(user_id, int):
            return {"error": "El campo 'user_id' debe ser un número entero."}, 400

        usuario = db.session.query(UserModel).get(user_id)
        if not usuario:
            return {"error": f"Usuario con id {user_id} no encontrado."}, 404

        if status not in ESTADOS_VALIDOS:
            return {"error": "Estado no válido"}, 400

        if not productos:
            return {"error": "Debes agregar al menos un producto al pedido."}, 400

        order = OrderModel(user_id=user_id, status=status, total_amount=0)
        db.session.add(order)
        db.session.flush()

        total = 0
        for producto in productos:
            try:
                product_id = int(producto.get("product_id"))
            except (ValueError, TypeError):
                return {"error": "El campo 'product_id' debe ser un número entero válido."}, 400

            try:
                cantidad = int(producto.get("quantity", 1))
                if cantidad <= 0:
                    return {"error": f"La cantidad del producto con id {product_id} debe ser mayor que 0."}, 400
            except (ValueError, TypeError):
                return {"error": f"La cantidad del producto con id {product_id} debe ser un número entero válido."}, 400

            product = db.session.query(ProductModel).get(product_id)
            if not product:
                return {"error": f"Producto con id {product_id} no encontrado."}, 404

            if product.stock is None or product.stock < cantidad:
                return {"error": f"No hay stock suficiente para el producto con id {product_id}."}, 400

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

            product.stock -= cantidad  # Actualizamos el stock

        order.total_amount = total
        db.session.commit()
        return order.to_json(), 201