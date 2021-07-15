import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class LoggingConsumer(WebsocketConsumer):
    def connect(self):
        # self.scope['url_route']['kwargs']['room_name']
        self.room_name = 'logging'
        self.room_group_name = 'v2g_logging'

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        # Send message to room group
        print(f"receive group board cast {message}")
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'log.message',
                'message': message
            }
        )

    # Receive message from room group
    def log_message(self, event):
        message = event['message']
        # Send message to WebSocket
        print(f"send {message}")
        self.send(text_data=json.dumps({
            'message': message
        }))