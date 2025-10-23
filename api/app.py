# api/app.py
from fastapi import FastAPI
from .routers import products

app = FastAPI(title="Marketplace API")
app.include_router(products.router)
