import os
from flask import Flask, render_template
# from flask_mail import Mail, Message


template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, "Frontend", "templates")
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, "Frontend", "static")

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USERNAME'] = 'arijzaidi23@gmail.com'
# app.config['MAIL_PASSWORD'] = 'arij11649778'  # Use App Password for Gmail
# app.config['MAIL_DEFAULT_SENDER'] = 'arijzaidi23@gmail.com'

# mail = Mail(app)
@app.route('/')
def index():
    return render_template('index.html')
if __name__ == "__main__":
    app.run(debug=True, port=5000)

