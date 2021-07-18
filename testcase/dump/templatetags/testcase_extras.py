from django.template.defaulttags import register
from django import template

register = template.Library()

@register.simple_tag(name='get_item')
def get_item(dictionary:dict, msg, field):
    return dictionary.get(msg).get(field)

@register.simple_tag(name='list_index')
def list_index(list_input:list, idx):
    return list_input[idx]