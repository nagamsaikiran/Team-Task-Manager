from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.user import UserOut

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class MemberAdd(BaseModel):
    email: str
    role: str = "member"

class MemberOut(BaseModel):
    id: int
    user: UserOut
    role: str

    model_config = {"from_attributes": True}

class ProjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    owner_id: int
    created_at: datetime
    members: List[MemberOut] = []

    model_config = {"from_attributes": True}
