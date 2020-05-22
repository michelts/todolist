from .tasks import blueprint as tasks_blueprint
from .users import blueprint as users_blueprint

__all__ = ["users_blueprint", "tasks_blueprint"]
