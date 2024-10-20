from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from models import DeviceModel, Device, DeviceUpdate
from database import engine, get_db, Base
from fastapi.middleware.cors import CORSMiddleware


# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Thay thế "" bằng các nguồn gốc cụ thể nếu cần
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"Hello": "World"}


# Create a new device
@app.post("/devices", response_model=Device)
def create_device(device: Device, db: Session = Depends(get_db)):
    # Check if device with the same ID already exists
    db_device = (
        db.query(DeviceModel).filter(DeviceModel.deviceId == device.deviceId).first()
    )
    if db_device:
        raise HTTPException(status_code=400, detail="Device already exists")

    # Create and add the new device to the database
    new_device = DeviceModel(**device.dict())
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device


# Get all devices
@app.get("/devices", response_model=list[Device])
def read_all_devices(db: Session = Depends(get_db)):
    return db.query(DeviceModel).all()


# Get a device by ID
@app.get("/devices/{device_id}", response_model=Device)
def read_device_by_id(device_id: str, db: Session = Depends(get_db)):
    db_device = db.query(DeviceModel).filter(DeviceModel.deviceId == device_id).first()
    if db_device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return db_device


# Update a device by ID
@app.put("/devices/{device_id}", response_model=Device)
def update_device(
    device_id: str, device_update: DeviceUpdate, db: Session = Depends(get_db)
):
    try:
        # Fetch the existing device from the database
        db_device = (
            db.query(DeviceModel).filter(DeviceModel.deviceId == device_id).first()
        )

        # Raise a 404 error if the device does not exist
        if db_device is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Device not found"
            )

        # Update the device fields with the new values
        update_data = device_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_device, key, value)

        # Commit the changes to the database
        db.commit()
        db.refresh(db_device)
        return db_device

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# Delete a device
@app.delete("/devices/{device_id}", response_model=dict)
def delete_device(device_id: str, db: Session = Depends(get_db)):
    db_device = db.query(DeviceModel).filter(DeviceModel.deviceId == device_id).first()
    if db_device is None:
        raise HTTPException(status_code=404, detail="Device not found")

    db.delete(db_device)
    db.commit()
    return {"detail": "Device deleted"}