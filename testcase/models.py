from django.db import models
from django.db.models.fields import AutoField, CharField, IntegerField, TextField
from base.models import BaseModel
from django.urls import reverse
from django.db.models.functions import Coalesce

class TestcaseManager(models.Manager):
    def create_testcase(self, name:str, type:str="CMN", status:str="n", build_status:str="NA", condition:str="", expected:str="", pics:str="", pixit:str="", path:str="", msg_type=None):
        tc = TestcaseType()
        if (name != ""):
            tc.name = name
        else:
            raise ValueError("Testcase name is not allowed to be blank")
        if (type in dict(TestcaseType.TESTCASE_TYPE)):
            tc.type = type
        else:
            raise ValueError(f"Testcase type must has value in {dict(TestcaseType.TESTCASE_TYPE)}")
        if (status in dict(TestcaseType.TESTCASE_STATUS)):
            tc.status = status
        else:
            raise ValueError(f"Testcase status must has value in {dict(TestcaseType.TESTCASE_STATUS)}")
        if (build_status in dict(TestcaseType.TESTCASE_BUILD_STATUS)):
            tc.build_status = build_status
        else:
            raise ValueError(f"Testcase build status must has value in {dict(TestcaseType.TESTCASE_BUILD_STATUS)}")
        tc.condition = condition
        tc.expected = expected
        tc.pics = pics
        tc.pixit = pixit
        tc.path = path
        if msg_type != None:
            tc.msg_type = msg_type
        return tc

    def with_counts(self):
        return self.annotate(
            num_responses=Coalesce(models.Count("response"), 0)
        )

    # return page of object
    def get_pages(self, pageno):
        pass

class MessageType(BaseModel):
    name = TextField(null=False, blank=False, unique=True)
    def __str__(self) -> str:
        return f"{self.name}"

# Create your models here.
class TestcaseType(BaseModel):
    '''
    primary_key
    If True, this field is the primary key for the model.
    If you don’t specify primary_key=True for any fields in your model, Django will automatically add an IntegerField to hold the primary key, so you don’t need to set primary_key=True on any of your fields unless you want to override the default primary-key behavior. For more, see Automatic primary key fields.
    unique
        If True, this field must be unique throughout the table.
    '''
    TESTCASE_TYPE = [('AC', 'AC Station'), ('DC', 'DC Station'), ('CMN', 'Common')]
    TESTCASE_STATUS = [('n', 'none'), ('p', 'pass'), ('i', 'inconclusion'), ('f', 'fail'), ('e', 'error')]
    TESTCASE_BUILD_STATUS = [('NA', 'Not available'), ('OK', 'Builded')]
    # index as primary key
    id = AutoField(primary_key=True)
    name = TextField(null=False, blank=False, unique=True)
    type = CharField(null=False, blank=False, choices=TESTCASE_TYPE, max_length=20, default='CMN')
    status = CharField(null=False, blank=False, choices=TESTCASE_STATUS, max_length=20, default='n')
    build_status = CharField(null=False, blank=False, choices=TESTCASE_BUILD_STATUS, max_length=20, default='NA')
    # describe test case objective input condition
    condition = TextField(null=False, blank=True)
    # describe test case objective expected output behavior
    expected = TextField(null=False, blank=True)
    # test case Protocol Implementation Conformance Statement (PICS) configuration - json string
    pics = TextField(null=False, blank=True)
    # test case Protocol Implementation extra Information for Testing (PIXIT) configuration - json string
    pixit = TextField(null=False, blank=True)
    path = TextField(null=False, blank=True)
    msg_type = models.ForeignKey('MessageType', on_delete=models.SET_NULL, null=True)
    objects = TestcaseManager()

    def get_absolute_url(self):
        return reverse('testcase-detail', args=[str(self.id)])
