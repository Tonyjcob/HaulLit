from pydantic import BaseModel

from app.models import CodeStatus


class CodeValidateRequest(BaseModel):
    code: str


class CodeValidateResponse(BaseModel):
    id: int
    code: str
    status: CodeStatus


class CodeStatusResponse(BaseModel):
    active: bool
