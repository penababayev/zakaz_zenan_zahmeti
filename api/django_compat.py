# api/django_compat.py
"""
Initialize Django so we can reuse its password hashers and settings inside FastAPI.
Assumes your Django settings module is `backend.settings`.
Adjust DJANGO_SETTINGS_MODULE below if your path differs.
"""

import os
import django

DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "backend.settings")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)

# Safe to call multiple times; Django ignores subsequent setup() calls
try:
    django.setup()
except Exception as e:  # pragma: no cover
    # In dev we don't crash the import; routes will still raise meaningful errors
    raise
