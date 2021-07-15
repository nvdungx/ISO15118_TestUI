from django.urls import re_path

from testcase.consumers import ChatConsumer

channel_routing = [
    re_path(r'ws/sockets/$', ChatConsumer.as_asgi()),
]