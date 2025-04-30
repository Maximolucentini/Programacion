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