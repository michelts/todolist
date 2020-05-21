from marshmallow import Schema, fields


class TaskSchema(Schema):
    """ /api/v1/tasks/ - POST

    Parameters:
     - description (str)
     - priority (int)
     - due_date (date)
     - completed (bool)
    """

    description = fields.Str(required=True)
    priority = fields.Int(required=False)
    due_date = fields.Date(required=True)
    completed = fields.Boolean(required=False)
