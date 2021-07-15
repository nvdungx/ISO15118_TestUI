from .consumers import LoggingConsumer
import os, sys, json, re
import multiprocessing
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ExecTestcase:
    id = None
    name = ''
    isrunning = False
    status = ''
    build_status = ''
    path = ''
    slac_cfg_path = ''
    v2g_cfg_path = ''

    @staticmethod
    def is_valid():

        pass

    @staticmethod
    def is_available():
        pass

    @staticmethod
    def run():
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'v2g_logging',
            {
                'type': 'log.message',
                'message': 'Test message'
            }
        )
        pass

    @staticmethod
    def cancel():
        pass