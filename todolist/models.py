from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Task(db.Model):
    __tablename__ = "task"
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    priority = db.Column(db.Integer, default=0)
    due_date = db.Column(db.Date, nullable=False)
    completed = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return "<Todo id={id} task={task} priority={priority} due_date={due_date} completed={completed}>".format(
            id=self.id,
            task=self.task[:30],
            priority=self.priority,
            due_date=self.due_date.strftime("%Y-%m-%d"),
            completed="yes" if self.completed else "no",
        )

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "priority": self.priority,
            "due_date": self.due_date,
            "completed": self.completed,
        }
