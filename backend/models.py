from pydantic import BaseModel
from typing import List, Optional


class GroupCreate(BaseModel):
    group_name: str
    currency: str
    members: List[str]
    group_id: Optional[str] = None


class ExpenseCreate(BaseModel):
    paid_by: str
    amount: float
    participants: List[str]


class ExpenseUpdate(BaseModel):
    paid_by: Optional[str] = None
    amount: Optional[float] = None
    participants: Optional[List[str]] = None
