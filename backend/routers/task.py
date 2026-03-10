import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, Cookie, Depends, Response
from sqlalchemy.orm import Session

from models.task import Task
from schema.task import TaskCreate, TaskUpdate
from db.database import get_db

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

def get_session_id(session_id: Optional[str] = Cookie(None)):
    if not session_id:
        session_id = str(uuid.uuid4())
    return session_id

@router.post("/create")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    print(f"DEBUG: Pydantic date object: {task.due_date}")
    print(f"DEBUG: Type: {type(task.due_date)}")
    print(f"DEBUG: Input data: {task.model_dump()}")
    db_task = Task(title=task.title, description=task.description, priority=task.priority, due_date=task.due_date)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@router.put("/update/{task_id}")
def update_task(task_id: int, task:TaskUpdate ,db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db_task.title = task.title
    db_task.description = task.description
    db_task.priority = task.priority
    db_task.due_date = task.due_date
    db.commit()
    return {"message": "Task Updated Successfully"}
@router.delete("/delete/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task Deleted Successfully"}

