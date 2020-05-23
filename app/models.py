from flask_login import LoginManager, UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

db = SQLAlchemy()

login_manager = LoginManager()


class User(UserMixin, db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), index=True, unique=True)
    name = db.Column(db.String(200), index=True)
    password_hash = db.Column(db.String(128))

    def __repr__(self):
        return f"<User id={self.id}>"

    @property
    def password(self):
        raise AttributeError("password is not a readable attribute.")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
        }


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@login_manager.request_loader
def load_user_from_request(request):
    # first, try to login using the api_key url arg
    api_key = request.args.get("api_key")
    if api_key:
        user = User.query.filter_by(username=api_key).first()
        if user:
            return user

    return None


class Task(db.Model):
    __tablename__ = "task"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    priority = db.Column(db.Integer, default=0)
    due_date = db.Column(db.Date)
    is_completed = db.Column(db.Boolean, default=False)
    is_removed = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return "<Todo id={id}>".format(id=self.id)

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "priority": self.priority,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "is_completed": self.is_completed,
        }
