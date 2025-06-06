import os
from flask import Flask
from dotenv import load_dotenv
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy



api = Api()
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    load_dotenv()

    
    if not os.path.exists(os.getenv("DATABASE_PATH") + os.getenv("DATABASE_NAME")):
        os.mknod(os.getenv("DATABASE_PATH") + os.getenv("DATABASE_NAME"))

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///" + os.getenv("DATABASE_PATH") + os.getenv("DATABASE_NAME")
    )

    db.init_app(app)

    import main.resources as resources

    # Registrar recursos
    api.add_resource(resources.UsuariosResource, '/usuarios')
    api.add_resource(resources.UsuarioResource, '/usuario/<id>')

    api.add_resource(resources.ProductosResource, '/productos')
    api.add_resource(resources.ProductoResource, '/producto/<id>')

    api.add_resource(resources.PedidosResource, '/pedidos')
    api.add_resource(resources.PedidoResource, '/pedido/<id>')

    api.add_resource(resources.LoginResource, '/login')
    api.add_resource(resources.LogoutResource, '/logout')

    api.add_resource(resources.NotificacionResource, '/notificaciones')
    api.add_resource(resources.NotificacionesUsuarioResource, '/notificaciones/<int:user_id>')

    api.add_resource(resources.ValoracionResource, '/valoracion')
    api.add_resource(resources.ObtenerValoracionResource, '/valoracion/<int:producto_id>')
    
    api.init_app(app)

    return app
