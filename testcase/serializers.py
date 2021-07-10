from django.db.models import fields
from rest_framework import serializers
from .models import MessageType, TestcaseType

class TestcaseSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = TestcaseType
        fields = ['id', 'name', 'type', 'status',\
            'build_status', 'condition', 'expected',\
                'pics', 'pixit', 'path']

class MessageSerializer(serializers.ModelSerializer):
    CMN = serializers.SerializerMethodField('get_cmn')
    AC = serializers.SerializerMethodField('get_ac')
    DC = serializers.SerializerMethodField('get_dc')
    def get_cmn(self, object):
        return {"pass":object.testcasetype_set.filter(type='CMN', status='p').count(), "total":object.testcasetype_set.filter(type='CMN').count()}
    def get_ac(self, object):
        queryset = object.testcasetype_set.all()
        return {"pass":object.testcasetype_set.filter(type='AC', status='p').count(), "total":object.testcasetype_set.filter(type='AC').count()}
    def get_dc(self, object):
        queryset = object.testcasetype_set.all()
        return {"pass":object.testcasetype_set.filter(type='DC', status='p').count(), "total":object.testcasetype_set.filter(type='DC').count()}

    class Meta(object):
        model = MessageType
        fields = ['id', 'name', "CMN", "AC", "DC"]