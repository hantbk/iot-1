class Device:
    def __init__(self, id, deviceId, qrCodeId, qrCodeValue):
        self.id = id
        self.deviceId = deviceId
        self.qrCodeId = qrCodeId
        self.qrCodeValue = qrCodeValue

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'deviceId': self.deviceId,
            'qrCodeId': self.qrCodeId,
            'qrCodeValue': self.qrCodeValue
        }
