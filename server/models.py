from sqlalchemy import Column, String
from database import Base
from pydantic import BaseModel
from typing import Optional


# SQLAlchemy model
class DeviceModel(Base):
    __tablename__ = "devices"

    deviceId = Column(String, primary_key=True, index=True)
    qrCodeId = Column(String, index=True)
    qrCodeValue = Column(String)

# Pydantic schema
class Device(BaseModel):
    deviceId: str
    qrCodeId: str
    qrCodeValue: str

    class Config:
        from_attributes = True


class DeviceUpdate(BaseModel):
    qrCodeId: Optional[str] = None
    qrCodeValue: Optional[str] = None

    class Config:
        from_attributes = True
