import random
import time
import json

from paho.mqtt import client as mqtt_client


broker = "broker.emqx.io"
port = 1883
topic = "python/mqtt"
client_id = f"publish-{random.randint(0, 1000)}"


def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n" % rc)

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def publish(client):
    data = {
        "id": 11,
        "packet_no": 126,
        "temperature": 30,
        "humidity": 60,
        "tds": 1100,
        "pH": 5.0,
    }
    while True:
        time.sleep(1)
        msg = json.dumps(data)
        result = client.publish(topic, msg)
        status = result[0]
        if status == 0:
            print(f"Send `{msg}` to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")
        # data["packet_no"] += 1


def run():
    client = connect_mqtt()
    client.loop_start()
    publish(client)
    client.loop_stop()


if __name__ == "__main__":
    run()
