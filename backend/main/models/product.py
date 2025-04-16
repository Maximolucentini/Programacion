from .. import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    estado = db.Column(db.String(50), nullable=False, default="activo")  
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    # Relaciones
    ratings = db.relationship("Rating", back_populates="product", cascade="all, delete-orphan")
    order_products = db.relationship("OrderProduct", back_populates="product", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Product {self.id} - {self.name}>'

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": float(self.price),
            "stock": self.stock,
            "estado": self.estado,  
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "updated_at": self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
        }

    def to_json_short(self):
        return {
            "id": self.id,
            "name": self.name,
        }

    def to_json_complete(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": float(self.price),
            "stock": self.stock,
            "estado": self.estado,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "updated_at": self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            "ratings": [rating.to_json_short() for rating in self.ratings],
            "order_products": [op.to_json_short() for op in self.order_products],
        }

    @staticmethod
    def from_json(data):
        return Product(
            id=data.get('id'),
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            stock=data.get('stock'),
            estado=data.get('estado', 'activo'),
            created_at=datetime.strptime(data['created_at'], '%Y-%m-%d %H:%M:%S') if 'created_at' in data else datetime.now(),
            updated_at=datetime.strptime(data['updated_at'], '%Y-%m-%d %H:%M:%S') if 'updated_at' in data else datetime.now(),
        )
