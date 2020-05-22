from marshmallow import Schema, fields


class TaskCreateSchema(Schema):
    description = fields.Str(required=True)
    priority = fields.Int(required=False)
    due_date = fields.Date(required=False, allow_none=True)
    is_completed = fields.Boolean(required=False)


class TaskUpdateSchema(TaskCreateSchema):
    description = fields.Str(required=True)
    priority = fields.Int(required=True)
    due_date = fields.Date(required=True, allow_none=True)
    is_completed = fields.Boolean(required=True)
