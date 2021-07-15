from django.urls import re_path

from testcase.consumers import LoggingConsumer

channel_routing = [
    re_path(r'ws/sockets/$', LoggingConsumer.as_asgi()),
]