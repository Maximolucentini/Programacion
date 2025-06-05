import os
from flask import Flask
from dotenv import load_dotenv
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager



api = Api()
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    load_dotenv()

    
    if not os.path.exists(os.getenv("DATABASE_PATH") + os.getenv("DATABASE_NAME")):
        os.mknod(os.getenv("DATABASE_PATH") + os.getenv("DATABASE_NAME"))

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///" + os.getenv("DATABASE_PATH") + os.getenv("DATABASE_NAME")
    )
    
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES"))

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
    
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES'))
    jwt.init_app(app)


    
    from main.auth.routes import auth
    app.register_blueprint(auth)

    return app
