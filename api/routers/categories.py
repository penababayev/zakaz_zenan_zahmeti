# api/routers/categories.py
from typing import Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..deps import get_db
from ..models.category import Category
from ..schemas.category import CategoryOut, CategoryNode

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    rows = db.query(Category).order_by(Category.name.asc()).all()
    return rows


@router.get("/tree", response_model=List[CategoryNode])
def tree(db: Session = Depends(get_db)):
    rows: List[Category] = db.query(Category).all()

    # Build map id -> node (dict with children list)
    node_map: Dict[int, CategoryNode] = {}
    for r in rows:
        node_map[r.id] = CategoryNode(
            id=r.id, name=r.name, slug=r.slug, parent_id=r.parent_id, children=[]
        )

    roots: List[CategoryNode] = []
    for r in rows:
        node = node_map[r.id]
        if r.parent_id and r.parent_id in node_map:
            node_map[r.parent_id].children.append(node)
        else:
            roots.append(node)

    # Sort children alphabetically by name for stable tree
    def sort_node(n: CategoryNode):
        n.children.sort(key=lambda c: c.name.lower())
        for ch in n.children:
            sort_node(ch)

    for root in roots:
        sort_node(root)

    roots.sort(key=lambda c: c.name.lower())
    return roots
