from flask_restful import Resource
from flask import request
from .. import db
from main.models import OrderModel, OrderProductModel,ProductModel,UserModel
from sqlalchemy import asc, desc
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from main.auth.decorators import role_required




ESTADOS_VALIDOS = ["pendiente", "en preparación", "en camino", "entregado", "cancelado"]

class Pedido(Resource):
    @jwt_required()
    def get(self, id):
        pedido = db.session.query(OrderModel).get(id)
        if not pedido:
            return {"error": "Pedido no encontrado"}, 404

        user_id = get_jwt_identity()
        rol = get_jwt().get("rol")

        if rol == "admin" or pedido.user_id == user_id:
            return pedido.to_json_complete(), 200
        return {"error": "No tienes permiso para ver este pedido"}, 403
    
        
    @jwt_required()
    def put(self, id):
        pedido = db.session.query(OrderModel).get(id)
        if not pedido:
            return {"error": "Pedido no encontrado"}, 404

        user_id = get_jwt_identity()
        rol = get_jwt().get("rol")

        if rol != "admin" and pedido.user_id != user_id:
            return {"error": "No tienes permiso para modificar este pedido"}, 403

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
    
    @jwt_required()
    def delete(self, id):
        pedido = db.session.query(OrderModel).get(id)
        if not pedido:
            return {"error": "Pedido no encontrado"}, 404

        user_id = get_jwt_identity()
        rol = get_jwt().get("rol")

        if rol != "admin" and pedido.user_id != user_id:
            return {"error": "No tienes permiso para eliminar este pedido"}, 403

        db.session.delete(pedido)
        db.session.commit()
        return {"mensaje": "Pedido eliminado"}, 200



class Pedidos(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        rol = get_jwt().get("rol")
        
        try:
            page = int(request.args.get("page", 1))
            per_page = int(request.args.get("per_page", 10))
        except ValueError:
            return {"error": "page y per_page deben ser enteros válidos"}, 400

        query = db.session.query(OrderModel)
        
        if rol != "admin":
            query = query.filter(OrderModel.user_id == user_id)

        
        status = request.args.get("status")
        if status:
            if status not in ESTADOS_VALIDOS:
                return {"error": f"Estado no válido. Opciones: {', '.join(ESTADOS_VALIDOS)}"}, 400
            query = query.filter(OrderModel.status == status)

        user_id = request.args.get("user_id")
        if user_id:
            try:
                user_id = int(user_id)
                query = query.filter(OrderModel.user_id == user_id)
            except ValueError:
                return {"error": "user_id debe ser un número entero"}, 400

        try:
            if min_total := request.args.get("min_total"):
                query = query.filter(OrderModel.total_amount >= float(min_total))
            if max_total := request.args.get("max_total"):
                query = query.filter(OrderModel.total_amount <= float(max_total))
        except ValueError:
            return {"error": "min_total y max_total deben ser números válidos"}, 400

        
        valid_sort_options = {
            "created_at_asc": asc(OrderModel.created_at),
            "created_at_desc": desc(OrderModel.created_at),
            "total_asc": asc(OrderModel.total_amount),
            "total_desc": desc(OrderModel.total_amount)
        }

        sort_by = request.args.get("sort_by")
        if sort_by:
            if sort_by not in valid_sort_options:
                return {"error": f"sort_by inválido. Opciones: {', '.join(valid_sort_options)}"}, 400
            query = query.order_by(valid_sort_options[sort_by])

        
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)

        return {
            "pedidos": [p.to_json() for p in paginated.items],
            "total": paginated.total,
            "pages": paginated.pages,
            "current_page": page
        }, 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()

        
        
        data = request.get_json()

        user_id = data.get("user_id")
        status = data.get("status")
        productos = data.get("productos", [])

        if not isinstance(user_id, int):
            return {"error": "El campo 'user_id' debe ser un número entero."}, 400

        usuario = db.session.query(UserModel).get(user_id)
        if not usuario:
            return {"error": f"Usuario con id {user_id} no encontrado."}, 404
        
        if not usuario or usuario.estado != "activo":
            return {"error": "Usuario inválido o suspendido"}, 403
        

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
            
            if product.estado != "activo":
                return {"error": f"El producto con id {product_id} está suspendido y no puede ser agregado al pedido."}, 400

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

            product.stock -= cantidad  

        order.total_amount = total
        db.session.commit()
        return order.to_json(), 201