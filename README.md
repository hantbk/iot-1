# iot

## Setup ENV
```bash
python -m venv venv
source venv/bin/activate
```

## Install library
```bash
pip install -r requirements.txt
```

## Run Server
```bash
cd server
uvicorn main:app --reload 
```