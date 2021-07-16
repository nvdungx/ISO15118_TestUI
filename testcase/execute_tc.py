from .consumers import LoggingConsumer
import os, sys, json, re
import multiprocessing
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import inspect

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
    def get_response_data():
        ATTRIBUTES = inspect.getmembers(ExecTestcase, lambda a:not(inspect.isroutine(a)))
        return dict([a for a in ATTRIBUTES if not(a[0].startswith('__') and a[0].endswith('__'))])


    @staticmethod
    def is_valid():

        pass

    @staticmethod
    def is_available():
        pass
    
    @staticmethod
    def __log(msg, status='none'):
        channel_layer = get_channel_layer()
        # change status to update when change from/to execute/cancel
        async_to_sync(channel_layer.group_send)(
            'v2g_logging',
            {
                'status': status,
                'type': 'log.message',
                'message': msg
            }
        )

    @staticmethod
    def run(testcase, v2g_config, slac_config):
        ExecTestcase.id = testcase.id
        ExecTestcase.name = testcase.name
        ExecTestcase.isrunning = True
        ExecTestcase.slac_cfg_path = slac_config
        ExecTestcase.v2g_cfg_path = v2g_config
        ExecTestcase.__log(f"---- Start execute {testcase.name} ----", 'update')

        ExecTestcase.__log(f"---- Execute {testcase.name} completed ----", 'update')

    @staticmethod
    def cancel():
        ExecTestcase.__log(f"---- Cancel {ExecTestcase.name} ----", 'update')
        ExecTestcase.id = ''
        ExecTestcase.name = ''
        ExecTestcase.isrunning = False
        ExecTestcase.slac_cfg_path = ''
        ExecTestcase.v2g_cfg_path = ''
        return True, "operation cancel successfully"