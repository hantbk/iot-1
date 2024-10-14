import sqlite3
import random
import datetime
from models import Device


def getNewId():
    return random.getrandbits(28)


devices = [
    {
        'deviceId': 'haohao',
        'qrCodeId': 'A Tale of Two Citie',
        'qrCodeValue': 'aaa'
    }
]


def connect():
    conn = sqlite3.connect('devices.db')
    cur = conn.cursor()
    cur.execute(
        "CREATE TABLE IF NOT EXISTS devices (id INTEGER PRIMARY KEY, deviceId TEXT, qrCodeId TEXT, qrCodeValue TEXT)")
    conn.commit()
    conn.close()
    for i in devices:
        d = Device(getNewId(), i['deviceId'], i['qrCodeId'], i['qrCodeValue'])
        insert(d)


def insert(device):
    conn = sqlite3.connect('devices.db')
    cur = conn.cursor()
    cur.execute("INSERT INTO devices VALUES (?,?,?,?)", (
        device.id,
        device.deviceId,
        device.qrCodeId,
        device.qrCodeValue
    ))
    conn.commit()
    conn.close()


def view():
    conn = sqlite3.connect('devices.db')
    cur = conn.cursor()
    cur.execute("SELECT * FROM devices")
    rows = cur.fetchall()
    devices = []
    for i in rows:
        d = Device(i[0], i[1], i[2], i[3])
        devices.append(d)
    conn.close()
    return devices


def update(device):
    conn = sqlite3.connect('devices.db')
    cur = conn.cursor()
    cur.execute("UPDATE devices SET qrCodeId=?, qrCodeValue=? WHERE deviceId=?",
                (device.qrCodeId, device.qrCodeValue, device.deviceId))
    conn.commit()
    conn.close()


def delete(deviceId):
    conn = sqlite3.connect('devices.db')
    cur = conn.cursor()
    cur.execute("DELETE FROM devices WHERE deviceId=?", (deviceId,))
    conn.commit()
    conn.close()


def deleteAll():
    conn = sqlite3.connect('devices.db')
    cur = conn.cursor()
    cur.execute("DELETE FROM devices")
    conn.commit()
    conn.close()
