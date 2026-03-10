from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import config
from routers import task
from db.database import create_tables

create_tables()
app = FastAPI(
    title="To Do List",
    description="To Do List API",
    version="0.1",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=config.ALLOWED_ORIGINS,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(task.router, prefix=config.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)