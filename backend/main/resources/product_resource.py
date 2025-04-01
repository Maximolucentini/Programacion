from flask_restful import Resource
from flask import request

# Simulación de base de datos de productos (solo hamburguesas por ahora)
PRODUCTOS = {
    1: {"nombre": "Hamburguesa Clásica"},
    2: {"nombre": "Hamburguesa Doble"},
    3: {"nombre": "Hamburguesa con Bacon"},
}

# /producto/<id>
class Producto(Resource):
    def get(self, id):
        id = int(id)
        if id in PRODUCTOS:
            return PRODUCTOS[id], 200
        return {"error": "Producto no encontrado"}, 404

    def put(self, id):
        id = int(id)
        if id in PRODUCTOS:
            data = request.get_json()
            PRODUCTOS[id].update(data)
            return {"mensaje": "Producto actualizado", "producto": PRODUCTOS[id]}, 200
        return {"error": "Producto no encontrado"}, 404

    def delete(self, id):
        id = int(id)
        if id in PRODUCTOS:
            del PRODUCTOS[id]
            return {"mensaje": "Producto eliminado"}, 200
        return {"error": "Producto no encontrado"}, 404

# /productos
class Productos(Resource):
    def get(self):
        return PRODUCTOS, 200

    def post(self):
        data = request.get_json()
        nuevo_id = max(PRODUCTOS.keys(), default=0) + 1
        PRODUCTOS[nuevo_id] = data
        return {"mensaje": "Producto creado", "producto": PRODUCTOS[nuevo_id]}, 201
