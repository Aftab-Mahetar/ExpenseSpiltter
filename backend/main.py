from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.group import router as group_router
from routes.expense import router as expense_router

app = FastAPI(title="ExpenseSplitter API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(group_router)
app.include_router(expense_router)


@app.get("/")
def root():
    return {"message": "ExpenseSplitter API is running"}
