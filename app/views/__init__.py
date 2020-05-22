from .home import blueprint as home_blueprint
from .tasks import blueprint as tasks_blueprint
from .users import blueprint as users_blueprint

__all__ = ["home_blueprint", "users_blueprint", "tasks_blueprint"]
