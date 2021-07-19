from .consumers import LoggingConsumer
import os, sys, json, re
import threading, subprocess
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import inspect, time
from .models import TestcaseType, TestcaseManager, MessageType

RETURN_CODE_MAP = {
    0:'n',
    1:'p',
    2:'i',
    3:'f',
    4:'e'
}
RETURN_CODE_MAP_LONG = {
    0:'none',
    1:'pass',
    2:'inconclude',
    3:'fail',
    4:'error'
}
class ExecTestcase(threading.Thread):
    def __init__(self, testcase, v2g_cfg, slac_cfg):
        if (testcase != None):
            self.id = testcase.id
            self.tc_name = testcase.name
            self.status = testcase.status
            self.build_status = testcase.build_status
            self.path = testcase.path
        else:
            self.id = 0
            self.tc_name = ''
            self.status = 'n'
            self.build_status = 'NA'
            self.path = ''
        self.isrunning = False
        self.v2g_cfg_path = v2g_cfg
        self.slac_cfg_path = slac_cfg
        self.handle = None
        super().__init__()

    def __log(self, msg, status='none'):
        channel_layer = get_channel_layer()
        # change status to update when change from/to execute/cancel
        # msg = f"{msg.strip()}\n"
        async_to_sync(channel_layer.group_send)(
            'v2g_logging',
            {
                'status': status,
                'type': 'log.message',
                'message': f"{msg}"
            }
        )
    def kill(self):
        if (self.handle.poll() == None):
            self.isrunning = False
            self.handle.kill()
            while (self.handle.poll() == None):
                pass
            self.__log(self.handle.stdout.read())
            self.__log(f"---- Cancel {self.tc_name} ----\n", 'update')
            return True
        else:
            return False

    def run(self) -> None:
        try:
            self.isrunning = True
            self.__log(f"---- Start execute {self.tc_name} ----\n", 'update')
            self.handle = subprocess.Popen([self.path, self.tc_name, self.v2g_cfg_path, self.slac_cfg_path], stdout=subprocess.PIPE, universal_newlines=True)

            while (self.handle.poll() == None):
                for line in iter(self.handle.stdout.readline, ''):
                    self.__log(line)
                # self.__log(''.join(self.handle.stdout.readlines()))
                # self.__log(self.handle.stdout.read(1024))
            if (self.isrunning):
                self.isrunning = False
                self.__log(self.handle.stdout.read())
                try:
                    tc = TestcaseType.objects.get(id=self.id)
                    if (self.handle.returncode in RETURN_CODE_MAP.keys()):
                        tc.status = RETURN_CODE_MAP[self.handle.returncode]
                    tc.save()
                    self.__log(f"---- Execute {self.tc_name} completed - status code: {RETURN_CODE_MAP_LONG[self.handle.returncode]} ----\n", 'update')
                except Exception as e:
                    self.__log(f"---- Execute {self.tc_name} completed - {e.args} ----\n", 'update')
        except Exception as e:
            self.__log(f"Error: {e.args}", 'none')

    def get_response_data(self):
        # ATTRIBUTES = inspect.getmembers(self, lambda a:not(inspect.isroutine(a)))
        # return dict([a for a in ATTRIBUTES if not((a[0].startswith('__') and a[0].endswith('__')) or (a[0] == "handle"))])
        return {
            "id": self.id,
            "name": self.tc_name,
            "status": self.status,
            "build_status": self.build_status,
            "isrunning": self.isrunning,
            "path": self.path,
        }

class TestExecManagement:
    # should create list of object handle incase of multiple execution
    # for now only 1 object available
    exec_object = ExecTestcase(None , "", "")

    @staticmethod
    def get_current_exec():
        return TestExecManagement.exec_object.get_response_data()

    @staticmethod
    def create_exec(testcase, v2g_cfg_path, slac_cfg_path):
        TestExecManagement.exec_object = ExecTestcase(testcase, v2g_cfg_path, slac_cfg_path)
        TestExecManagement.exec_object.setName(testcase.name)

    @staticmethod
    def is_available():
        return not TestExecManagement.exec_object.isrunning

    @staticmethod
    def deploy(id):
        if (not TestExecManagement.exec_object.is_alive()):
            TestExecManagement.exec_object.start()

    @staticmethod
    def cancel(id):
        try:
            if (TestExecManagement.exec_object.is_alive()):
                if (TestExecManagement.exec_object.kill()):
                    TestExecManagement.exec_object.join()
                    TestExecManagement.exec_object.is_alive()
                    return True, f"Testcase {TestExecManagement.exec_object.tc_name} is cancelled"
                else:
                    return False, f"Testcase {TestExecManagement.exec_object.tc_name} is not in execution"
            else:
                return False, f"Testcase {TestExecManagement.exec_object.tc_name} is not in execution"
        except Exception as e:
            return None, str(e.args)
