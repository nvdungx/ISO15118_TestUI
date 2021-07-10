from django.contrib import admin

# Register your models here.
from .models import MessageType, TestcaseType

@admin.register(TestcaseType)
class TestcaseAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'status')
    list_filter = ('type', 'status', 'msg_type')
    fields = [('name', 'type', 'status'),\
        'path', 'condition', 'expected', 'pics', 'pixit', 'msg_type']

@admin.register(MessageType)
class MessageAdmin(admin.ModelAdmin):
    pass