from sqlalchemy import Column, Integer, ForeignKey, String, DATE, DATETIME, Boolean
from sqlalchemy.sql import func
from db.database import Base

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    is_completed = Column(Boolean, index=True, default=False)
    priority = Column(String, index=True)
    created_at = Column(DATETIME, server_default=func.now())
    due_date = Column(DATETIME, nullable=True)
