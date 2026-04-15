from fastapi import APIRouter, HTTPException
from bson import ObjectId
from collections import defaultdict

from database import groups_collection, expenses_collection
from models import ExpenseCreate, ExpenseUpdate
from datetime import datetime, timezone

router = APIRouter()


def serialize_expense(exp: dict) -> dict:
    exp["_id"] = str(exp["_id"])
    return exp


@router.post("/add-expense/{groupId}")
def add_expense(groupId: str, data: ExpenseCreate):
    # Try fetching as string first
    group = groups_collection.find_one({"_id": groupId})
    if not group:
        try:
            group = groups_collection.find_one({"_id": ObjectId(groupId)})
        except Exception:
            pass
            
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    if data.paid_by not in group["members"]:
        raise HTTPException(status_code=400, detail="paid_by must be a group member")

    for p in data.participants:
        if p not in group["members"]:
            raise HTTPException(status_code=400, detail=f"{p} is not a group member")

    expense_doc = {
        "group_id": groupId,
        "paid_by": data.paid_by,
        "amount": data.amount,
        "participants": data.participants,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = expenses_collection.insert_one(expense_doc)
    expense_doc["_id"] = str(result.inserted_id)
    return expense_doc


@router.get("/expenses/{groupId}")
def get_expenses(groupId: str):
    # We don't mandate ObjectId anymore since group strings exist.
    # We can just let the query run.

    
    # Sort by created_at descending (newest first)
    expenses = list(expenses_collection.find({"group_id": groupId}).sort("created_at", -1))
    return [serialize_expense(exp) for exp in expenses]


@router.delete("/expense/{expenseId}")
def delete_expense(expenseId: str):
    try:
        oid = ObjectId(expenseId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid expense ID")

    result = expenses_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
        
    return {"status": "deleted"}


@router.put("/expense/{expenseId}")
def update_expense(expenseId: str, data: ExpenseUpdate):
    try:
        oid = ObjectId(expenseId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid expense ID")

    # Find the expense to make sure it exists
    expense = expenses_collection.find_one({"_id": oid})
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    # We also have to validate if the new paid_by and participants are in the group
    group_id_val = expense["group_id"]
    group = groups_collection.find_one({"_id": group_id_val})
    if not group:
        try:
            group = groups_collection.find_one({"_id": ObjectId(group_id_val)})
        except Exception:
            pass

    if not group:
        raise HTTPException(status_code=404, detail="Associated group not found")

    update_fields = {}
    if data.paid_by is not None:
        if data.paid_by not in group["members"]:
            raise HTTPException(status_code=400, detail=f"paid_by '{data.paid_by}' must be a group member")
        update_fields["paid_by"] = data.paid_by

    if data.amount is not None:
        update_fields["amount"] = data.amount

    if data.participants is not None:
        for p in data.participants:
            if p not in group["members"]:
                raise HTTPException(status_code=400, detail=f"participant '{p}' is not a group member")
        update_fields["participants"] = data.participants

    if not update_fields:
        return serialize_expense(expense)

    expenses_collection.update_one({"_id": oid}, {"$set": update_fields})
    updated_expense = expenses_collection.find_one({"_id": oid})
    return serialize_expense(updated_expense)


@router.get("/settle/{groupId}")
def settle(groupId: str):
    # No ObjectId strict validation required since custom formats exist

    expenses = list(expenses_collection.find({"group_id": groupId}))

    # Compute net balance for each member
    balance: dict = defaultdict(float)
    for exp in expenses:
        paid_by = exp["paid_by"]
        amount = exp["amount"]
        participants = exp["participants"]
        if not participants:
            continue
        share = amount / len(participants)
        balance[paid_by] += amount
        for p in participants:
            balance[p] -= share

    # Greedy algorithm to minimize transactions
    creditors = []  # (amount, name)
    debtors = []    # (amount, name)

    for person, net in balance.items():
        if net > 0.005:
            creditors.append([net, person])
        elif net < -0.005:
            debtors.append([-net, person])

    creditors.sort(reverse=True)
    debtors.sort(reverse=True)

    transactions = []
    i, j = 0, 0
    while i < len(creditors) and j < len(debtors):
        credit_amt, creditor = creditors[i]
        debt_amt, debtor = debtors[j]

        settled = min(credit_amt, debt_amt)
        transactions.append({
            "from": debtor,
            "to": creditor,
            "amount": round(settled, 2),
        })

        creditors[i][0] -= settled
        debtors[j][0] -= settled

        if creditors[i][0] < 0.005:
            i += 1
        if debtors[j][0] < 0.005:
            j += 1

    return {"transactions": transactions}
