from .. import db
from datetime import datetime

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship("User", back_populates="notifications")

    def __repr__(self):
        return f'<Notification {self.id} - User {self.user_id}>'

    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "message": self.message,
            "is_read": self.is_read,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        }

    def to_json_short(self):
        return {
            "message": self.message
        }

    @staticmethod
    def from_json(data):
        return Notification(
            id=data.get('id'),
            user_id=data.get('user_id'),
            message=data.get('message'),
            is_read=data.get('is_read', False),
            created_at=datetime.strptime(data['created_at'], '%Y-%m-%d %H:%M:%S') if 'created_at' in data else datetime.now()
        )
