from flask import Flask
from dotenv import load_dotenv
from flask_restful import Api

import main.resources as resources

api = Api()

def create_app():
    app = Flask(__name__)
    load_dotenv()

    # Registrar rutas
    api.add_resource(resources.UsuariosResource, '/usuarios')
    api.add_resource(resources.UsuarioResource, '/usuario/<id>')

    api.add_resource(resources.ProductosResource, '/productos')
    api.add_resource(resources.ProductoResource, '/producto/<id>')

    api.add_resource(resources.PedidosResource, '/pedidos')
    api.add_resource(resources.PedidoResource, '/pedido/<id>')

    api.add_resource(resources.LoginResource, '/login')
    api.add_resource(resources.LogoutResource, '/logout')
    
    api.add_resource(resources.NotificacionResource, '/notificaciones')
    
    api.add_resource(resources.ValoracionResource, '/valoracion')
    api.add_resource(resources.ObtenerValoracionResource, '/valoracion/<int:producto_id>')



    api.init_app(app)
    return app

