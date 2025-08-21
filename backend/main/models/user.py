from .. import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    rol = db.Column(db.String(10), nullable=False, server_default="user")
    estado = db.Column(db.String(50), nullable=False, default="activo")
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    # Relaciones
    orders = db.relationship("Order", back_populates="user", cascade="all, delete-orphan")
    ratings = db.relationship("Rating", back_populates="user", cascade="all, delete-orphan")
    notifications = db.relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    
    @property
    def plain_password(self):
        raise AttributeError("La contraseña no se puede leer")

    @plain_password.setter
    def plain_password(self, password):
        self.password = generate_password_hash(password)

    def validate_pass(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.id} - {self.name}>'

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "estado": self.estado,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "updated_at": self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
        }

    def to_json_short(self):
        return {
            "id": self.id,
            "name": self.name,
            "estado": self.estado
        }

    def to_json_complete(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "estado": self.estado,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "updated_at": self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            "orders": [order.to_json_short() for order in self.orders],
            "ratings": [rating.to_json_short() for rating in self.ratings],
            "notifications": [notif.to_json_short() for notif in self.notifications],
        }

    @staticmethod
    def from_json(data):
        return User(
            id=data.get('id'),
            name=data.get('name'),
            email=data.get('email'),
            plain_password=data.get('password'),
            estado=data.get('estado', 'activo'),
            rol=data.get('rol', 'user'),
            created_at=datetime.strptime(data['created_at'], '%Y-%m-%d %H:%M:%S') if 'created_at' in data else datetime.now(),
            updated_at=datetime.strptime(data['updated_at'], '%Y-%m-%d %H:%M:%S') if 'updated_at' in data else datetime.now(),
        )
