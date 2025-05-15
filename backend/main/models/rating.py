from .. import db
from datetime import datetime

class Rating(db.Model):
    __tablename__ = 'ratings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship("User", back_populates="ratings")
    product = db.relationship("Product", back_populates="ratings")

    def __repr__(self):
        return f'<Rating {self.id} - User {self.user_id} - Product {self.product_id}>'

    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "score": self.score,
            "comment": self.comment,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        }

    def to_json_short(self):
        return {
            "score": self.score
        }

    @staticmethod
    def from_json(data):
        return Rating(
            id=data.get('id'),
            user_id=data.get('user_id'),
            product_id=data.get('product_id'),
            score=data.get('score'),
            comment=data.get('comment'),
            created_at=datetime.strptime(data['created_at'], '%Y-%m-%d %H:%M:%S') if 'created_at' in data else datetime.now()
        )
