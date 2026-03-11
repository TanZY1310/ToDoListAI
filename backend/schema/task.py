from datetime import date
from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: str
    is_completed: bool = False
    priority: str
    due_date: date

class TaskUpdate(BaseModel):
    title: str
    description: str
    is_completed: bool = False
    priority: str
    due_date: date