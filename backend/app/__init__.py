from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from flask_mail import Mail

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'routes.login'
migrate = Migrate()
mail = Mail()

def create_app():
    app = Flask(__name__, template_folder='frontend/templates', static_folder='frontend/static')
    app.config.from_object(Config)


    CORS(app, resources={
        r"/*": {
            "origins": ["https://www.smartovate.com"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Accept", "Authorization"],
            "supports_credentials": True
        }
    })

    db.init_app(app)
    mail.init_app(app)

    migrate.init_app(app, db)

    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    return app
