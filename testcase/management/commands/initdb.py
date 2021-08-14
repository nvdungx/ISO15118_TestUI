from enum import Enum, IntEnum
from django.core.management.base import BaseCommand, CommandError
from django.db import models
from testcase.models import TestcaseType, TestcaseManager, MessageType
import os, sys, re, shutil, subprocess, multiprocessing
from multiprocessing import Process
from django.core.management import call_command

class ParseItem:
    PREFIX_LIST = ["1. CONDITION:", "2. EXPECTED:", "3. PICS selection:", "4. PIXIT selection:", "verdict_val TestCases_SECC"]
    class PropName(IntEnum):
        condition=0
        expected=1
        pics=2
        pixit=3
        tc_name=4
    tc_counter = 0
    def __init__(self, _exec_path) -> None:
        self.exec_path = _exec_path
        self.cur_idx = 0
        self.next_idx = 0
        self.msg_name = ""
        self.map_prop = ["", "", "", "", ""]
        self.tc_type = None
        self.start_flag = False
    def reset(self):
        self.cur_idx = 0
        self.next_idx = 0
        self.msg_name = ""
        self.map_prop = ["", "", "", "", ""]
        self.tc_type = None
        self.start_flag = False
    def get(self, inputstr:str):
        # check if next prefix is in line
        if (ParseItem.PREFIX_LIST[self.next_idx] in inputstr):
            # if currentidx = last -> can't found msg name
            if self.cur_idx == (len(ParseItem.PREFIX_LIST)-1):
                self.map_prop[ParseItem.PropName.tc_name] = "Empty"
                self.tc_type = "CMN"
                self.save_testcase()
            # set start flag true
            self.start_flag = True
            # current idx store
            self.cur_idx = self.next_idx
            # next index
            self.next_idx = int((self.next_idx + 1)%len(ParseItem.PREFIX_LIST))
        # if start flag for current testcase is set
        if (self.start_flag == True):
            # if not last element
            if self.cur_idx != (len(ParseItem.PREFIX_LIST) - 1):
                inputstr = inputstr.replace(ParseItem.PREFIX_LIST[self.cur_idx], "").strip()
                self.map_prop[self.cur_idx] += f'{inputstr}\n'
            else:
                #void TestCases_SECC_Authorization::TC_SECC_CMN_VTB_Authorization_009()
                rematch = re.match(r"verdict_val (TestCases_.*)::(TC_SECC_(CMN|AC|DC)_VTB_.*_\d+)\(", inputstr)
                if (rematch != None):
                    self.map_prop[ParseItem.PropName.tc_name] = rematch.group(2)
                    self.tc_type = rematch.group(3)
                    self.msg_name = rematch.group(1)
                    self.save_testcase()

    def save_testcase(self):
        msg_type = None
        if (self.msg_name != ""):
            msg_type, _ = MessageType.objects.get_or_create(name = self.msg_name)
        try:
            tc = TestcaseType.objects.get(name=self.map_prop[ParseItem.PropName.tc_name])
            tc.condition = self.map_prop[ParseItem.PropName.condition]
            tc.expected = self.map_prop[ParseItem.PropName.expected]
            tc.pics = self.map_prop[ParseItem.PropName.pics]
            tc.pixit = self.map_prop[ParseItem.PropName.pixit]
            tc.path = self.exec_path
            tc.msg_type = msg_type
        except:
            tc = TestcaseType.objects.create(name=self.map_prop[ParseItem.PropName.tc_name],\
                type=self.tc_type, status="n", build_status="NA", condition=self.map_prop[ParseItem.PropName.condition],\
                expected=self.map_prop[ParseItem.PropName.expected], pics=self.map_prop[ParseItem.PropName.pics],\
                pixit=self.map_prop[ParseItem.PropName.pixit], path=self.exec_path, msg_type=msg_type)
        tc.save()
        print(f"{ParseItem.tc_counter}: {self.map_prop[ParseItem.PropName.tc_name]} saved")
        ParseItem.tc_counter += 1
        self.reset()

class Command(BaseCommand):
    help = 'Load initial testcase data from HLC workspace to database'
    def __init__(self) -> None:
        self.make_process = None
        super().__init__()

    def add_arguments(self, parser):
        # positional argument
        parser.add_argument('project_path', type=str)

    def handle(self, *args, **options):
        if (options['project_path']):
            if os.path.isdir(options['project_path']):
                project_path = os.path.abspath(options['project_path'])
                self.parse = ParseItem(os.path.join(project_path, 'build/TestSuite/runTC'))
                return_code = self.__make_project(project_path)
                self.__get_testcase_data(project_path)
                # get data from TestCase folder and load to data base
                if (return_code == 0):
                    if (0 == self.make_process.wait()):
                        for item in TestcaseType.objects.all():
                            item.build_status = "OK"
                            item.save()
                        self.stdout.write("---- INITIALIZE DATABASE COMPLETED ----")
                    else:
                        self.stderr.write("ERROR: failed to build HLC test program")
                else:
                    self.stderr.write("ERROR: failed to execute cmake, please check if cmake, unix makefiles is installed")
            else:
                self.stderr.write("ERROR: input project path is incorrect")

    def __make_project(self, _path):
        # create build folder
        build_path = os.path.join(_path, "build")
        if not os.path.isdir(build_path):
            os.mkdir(build_path)
        ret = subprocess.run(["cmake", "..", "-G", "Unix Makefiles"], cwd=build_path)
        if ret.returncode == 0:
            self.make_process = subprocess.Popen(["make", "-j", "2"], cwd=build_path)
            return 0
        else:
            self.stderr.write("ERROR: failed to generate cmake build folder")
            return 1
        # execute cmake, make


    def __get_testcase_data(self, _path):
        testcase_path = os.path.join(_path, "TestCase/src")
        if not os.path.isdir(testcase_path):
            self.stderr.write("ERROR: failed, TestCase folder is not exist")
        else:
            for cpp in sorted(os.listdir(testcase_path)):
                if ".cpp" in cpp:
                    file = os.path.join(testcase_path, cpp)
                    with open(file, "r", encoding="utf8") as fp:
                        for line in iter(fp.readline, ''):
                            line = line.replace("*/", "").replace("/**", "").strip()
                            if (line != ""):
                                self.parse.get(line)