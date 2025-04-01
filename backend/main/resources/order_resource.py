from flask_restful import Resource
from flask import request

# Simulación de base de datos de pedidos
PEDIDOS = {
    1: {"usuario_id": 1, "producto_id": 2, "estado": "pendiente"},
    2: {"usuario_id": 2, "producto_id": 1, "estado": "en preparación"},
}

# /pedido/<id>
class Pedido(Resource):
    def get(self, id):
        id = int(id)
        if id in PEDIDOS:
            return PEDIDOS[id], 200
        return {"error": "Pedido no encontrado"}, 404

    def put(self, id):
        id = int(id)
        if id in PEDIDOS:
            data = request.get_json()
            PEDIDOS[id].update(data)
            return {"mensaje": "Pedido actualizado", "pedido": PEDIDOS[id]}, 200
        return {"error": "Pedido no encontrado"}, 404

    def delete(self, id):
        id = int(id)
        if id in PEDIDOS:
            del PEDIDOS[id]
            return {"mensaje": "Pedido eliminado"}, 200
        return {"error": "Pedido no encontrado"}, 404

# /pedidos
class Pedidos(Resource):
    def get(self):
        return PEDIDOS, 200

    def post(self):
        data = request.get_json()
        nuevo_id = max(PEDIDOS.keys(), default=0) + 1
        PEDIDOS[nuevo_id] = data
        return {"mensaje": "Pedido creado", "pedido": PEDIDOS[nuevo_id]}, 201
