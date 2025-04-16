from .. import db

class OrderProduct(db.Model):
    __tablename__ = 'order_products'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)

    order = db.relationship("Order", back_populates="order_products")
    product = db.relationship("Product", back_populates="order_products")

    def to_json(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "subtotal": float(self.subtotal)
        }

    def to_json_short(self):
        return {
            "product_id": self.product_id,
            "quantity": self.quantity
        }

    @staticmethod
    def from_json(data):
        return OrderProduct(
            id=data.get('id'),
            order_id=data.get('order_id'),
            product_id=data.get('product_id'),
            quantity=data.get('quantity'),
            subtotal=data.get('subtotal'),
        )
