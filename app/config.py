import os

class Config:

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE_PATH = os.path.join(BASE_DIR, "..", "processing", "lokdrishti.db") 
    DATABASE_URI = f"sqlite:///{DATABASE_PATH}"
    DEFAULT_PAGE = 1
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100

    DEBUG = True
    SECRET_KEY = os.environ.get("SECRET_KEY", "lokdrishti-dev-secret")