from main import db
from datetime import datetime, date

class Promotion(db.Model):
    __tablename__ = "promotions"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500), nullable=False)

    
    fecha = db.Column(db.Date, nullable=False)

    
    estado = db.Column(db.String(20), nullable=False, default="activa")
    enviada = db.Column(db.Boolean, default=False)
    sent_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "fecha": self.fecha.strftime("%Y-%m-%d"),
            "estado": self.estado,
            "enviada": self.enviada,
            "sent_at": self.sent_at.strftime("%Y-%m-%d %H:%M:%S") if self.sent_at else None,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S") if self.updated_at else None,
        }

    @staticmethod
    def from_json(data):
        
        raw_fecha = data.get("fecha")

        parsed_fecha = None
        if isinstance(raw_fecha, str):
            parsed_fecha = datetime.strptime(raw_fecha, "%Y-%m-%d").date()
        elif isinstance(raw_fecha, date):
            parsed_fecha = raw_fecha

        return Promotion(
            title=data.get("title"),
            description=data.get("description"),
            fecha=parsed_fecha,
            estado=data.get("estado", "activa"),
        )
