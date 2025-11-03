# api/app.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import products, categories, favorites, orders, auth

app = FastAPI(title="Marketplace API")

# --- CORS AYARLARI ---
# Eğer .env içinde FRONTEND_ORIGINS değişkeni varsa (virgülle ayrılmış URL listesi)
# Örn: FRONTEND_ORIGINS=http://localhost:3000,https://myapp.vercel.app
origins_env = os.getenv("FRONTEND_ORIGINS")

if origins_env:
    allowed_origins = [o.strip() for o in origins_env.split(",") if o.strip()]
else:
    # Geliştirme ortamı için herkese açık (production'da özel liste ekle)
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ---
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(favorites.router)
app.include_router(orders.router)
