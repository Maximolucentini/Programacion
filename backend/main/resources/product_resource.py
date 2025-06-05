from flask_restful import Resource
from flask import request
from .. import db
from main.models import ProductModel
from sqlalchemy import asc, desc
from flask_jwt_extended import jwt_required, get_jwt
from main.auth.decorators import role_required


class Producto(Resource):
    @jwt_required(optional=True)
    def get(self, id):
        producto = db.session.query(ProductModel).get(id)
        if not producto:
            return {"error": "Producto no encontrado"}, 404

        rol = get_jwt().get("rol", None)
        if rol in ["user", "admin"]:
            return producto.to_json(), 200
        else:
            return producto.to_json_short(), 200
        
    @role_required(roles=["admin"])
    def put(self, id):
        producto = db.session.query(ProductModel).get(id)
        if not producto:
           return {"error": "Producto no encontrado"}, 404

        data = request.get_json()

        if 'name' in data:
           if not isinstance(data['name'], str) or not data['name'].strip():
              return {"error": "El nombre del producto debe ser texto y no puede estar vacío."}, 400

        if 'price' in data:
          try:
              if float(data['price']) <= 0:
                return {"error": "El precio debe ser mayor que 0."}, 400
          except (ValueError, TypeError):
                return {"error": "El campo 'price' debe ser un número válido."}, 400

        if 'stock' in data:
          try:
              if int(data['stock']) < 0:
                return {"error": "El stock no puede ser negativo."}, 400
          except (ValueError, TypeError):
                return {"error": "El campo 'stock' debe ser un número entero válido."}, 400

        for key, value in data.items():
         setattr(producto, key, value)

        db.session.commit()
        return {
        "mensaje": "Producto actualizado",
        "producto": producto.to_json()
        }, 200
     
    @role_required(roles=["admin"])
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
    @jwt_required(optional=True)
    def get(self):
        
        try:
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
        except ValueError:
            return {"error": "page y per_page deben ser enteros"}, 400

        query = db.session.query(ProductModel)

        

        if estado := request.args.get("estado"):
            if estado not in ["activo", "suspendido"]:
                return {"error": "El estado debe ser 'activo' o 'suspendido'"}, 400
            query = query.filter(ProductModel.estado == estado)

        if name := request.args.get("name"):
            query = query.filter(ProductModel.name.ilike(f"%{name}%"))

        try:
            if price_min := request.args.get("price_min"):
                query = query.filter(ProductModel.price >= float(price_min))
            if price_max := request.args.get("price_max"):
                query = query.filter(ProductModel.price <= float(price_max))
        except ValueError:
            return {"error": "price_min y price_max deben ser números válidos"}, 400

        try:
            if stock_min := request.args.get("stock_min"):
                query = query.filter(ProductModel.stock >= int(stock_min))
            if stock_max := request.args.get("stock_max"):
                query = query.filter(ProductModel.stock <= int(stock_max))
        except ValueError:
            return {"error": "stock_min y stock_max deben ser enteros válidos"}, 400

        

        valid_sort_options = {
            "name_asc": asc(ProductModel.name),
            "name_desc": desc(ProductModel.name),
            "price_asc": asc(ProductModel.price),
            "price_desc": desc(ProductModel.price),
            "stock_asc": asc(ProductModel.stock),
            "stock_desc": desc(ProductModel.stock)
        }

        sort_by = request.args.get("sort_by")
        if sort_by:
            if sort_by not in valid_sort_options:
                return {
                    "error": f"sort_by inválido. Opciones válidas: {', '.join(valid_sort_options.keys())}"
                }, 400
            query = query.order_by(valid_sort_options[sort_by])

    
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)
        
        rol = get_jwt().get("rol", None)
        if rol in ["user", "admin"]:
            productos = [p.to_json() for p in paginated.items]
        else:
            productos = [p.to_json_short() for p in paginated.items]

        return {
            "productos": [p.to_json() for p in paginated.items],
            "total": paginated.total,
            "pages": paginated.pages,
            "current_page": page
        }, 200

    @role_required(roles=["admin"])
    def post(self):
        data = request.get_json()    
        
        required_fields = ['name', 'price', 'stock']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
           return {"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}, 400

        
        if not isinstance(data['name'], str) or not data['name'].strip():
           return {"error": "El nombre del producto debe ser texto y no puede estar vacío."}, 400
       
        
        try:
           price = float(data['price'])
           if price <= 0:
            return {"error": "El precio debe ser mayor que 0."}, 400
        except (ValueError, TypeError):
          return {"error": "El campo 'price' debe ser un número válido."}, 400

        
        try:
           stock = int(data['stock'])
           if stock < 0:
            return {"error": "El stock no puede ser negativo."}, 400
        except (ValueError, TypeError):
           return {"error": "El campo 'stock' debe ser un número entero válido."}, 400

        producto = ProductModel.from_json(data)
        db.session.add(producto)
        db.session.commit()
        return {
        "mensaje": "Producto creado",
        "producto": producto.to_json()
     }, 201