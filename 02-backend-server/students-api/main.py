from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlmodel import Field, Session, SQLModel, create_engine, select


class Student(SQLModel, table=True):
    __tablename__ = "students"
    id: int | None = Field(default=None, primary_key=True)
    student_id: str = Field(max_length=7, unique=True)
    full_name: str = Field(max_length=50)
    department: str = Field(max_length=50)
    major: str = Field(max_length=50)


postgres_host = "relational-database"
# postgres_host = "localhost"
postgres_port = 5432
postgres_db = "miniwsdb"
postgres_user = "postgres"
postgres_password = "miniws"
postgres_url = f"postgresql+psycopg://{postgres_user}:{postgres_password}@{postgres_host}/{postgres_db}"

engine = create_engine(postgres_url)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


app = FastAPI()
templates = Jinja2Templates(directory="templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # create_db_and_tables()
    yield


@app.get("/api/students")
def read_students(session: SessionDep):
    students = session.exec(select(Student)).all()
    return students


@app.get("/students", response_class=HTMLResponse)
async def read_item(session: SessionDep, request: Request):
    students = session.exec(select(Student)).all()
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"students": students},
    )
