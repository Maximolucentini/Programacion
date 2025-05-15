from .. import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship("User", back_populates="orders")
    order_products = db.relationship("OrderProduct", back_populates="order", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Order {self.id} - User {self.user_id}>'

    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "status": self.status,
            "total_amount": float(self.total_amount),
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        }

    def to_json_short(self):
        return {
            "id": self.id,
            "status": self.status
        }

    def to_json_complete(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "status": self.status,
            "total_amount": float(self.total_amount),
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "products": [op.to_json() for op in self.order_products]
        }

    @staticmethod
    def from_json(data):
        return Order(
            id=data.get('id'),
            user_id=data.get('user_id'),
            status=data.get('status'),
            total_amount=data.get('total_amount'),
            created_at=datetime.strptime(data['created_at'], '%Y-%m-%d %H:%M:%S') if 'created_at' in data else datetime.now(),
        )
