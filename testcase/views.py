import collections
from typing import Any
import django
from django.db.models.query import QuerySet
from django.shortcuts import redirect, render, get_object_or_404
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db.models import Count
from django.conf import settings
from django.views.generic import detail
from drf_yasg import views
import rest_framework
from rest_framework.decorators import action
from rest_framework import renderers, viewsets, status, generics, mixins
import django_filters
from rest_framework.response import Response
from rest_framework.request import HttpRequest
from rest_framework.parsers import JSONParser, MultiPartParser
from .models import TestcaseType, MessageType
from .serializers import MessageSerializer, TestcaseSerializer
import re
import json
import multiprocessing


# Create your views here.

class TestcaseViewSet(viewsets.ModelViewSet):
    queryset = TestcaseType.objects.all()
    serializer_class = TestcaseSerializer
    pagination_class = None
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]

    # override queryset
    def get_queryset(self):
        # if query param has msg_type
        msg_type = self.request.query_params.get('msg_type')
        msg_name = self.request.query_params.get('name')
        if msg_type is not None:
            queryset = self.queryset.filter(msg_type__name__contains=msg_type)
            return queryset
        elif msg_name is not None:
            queryset = self.queryset.filter(name=msg_name)
            return queryset
        return self.queryset.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        if (queryset.count() > 1):
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        elif (queryset.count() == 0):
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            queryset = queryset.first()
            serializer = self.get_serializer(queryset, many=False)
            return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

class TestcaseExecute(mixins.UpdateModelMixin,viewsets.GenericViewSet):
    queryset = TestcaseType.objects.all()
    serializer_class = TestcaseSerializer

    def update(self, request, pk):
        try:
            tc = self.queryset.get(pk=pk)
            if ('cancel' in request.data.keys()):
                pass
                print(f"cancel{pk}")
                # check if testcase is available and cancel
            else:
                print(f"exec{pk}")
                v2g_path, slac_path = self.parse_config(request.data)
                # save json config file to /tmp/
                # call execute
                 
                # tc.path tc.name cfg_path
                # stream data back socket?
                # store log file
            return Response(None, status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e.args), status.HTTP_417_EXPECTATION_FAILED)

    def parse_config(self, test_config):
        v2g_config = {
            "timer": test_config["timer"],
            "pics": test_config["pics"],
            "pixit": test_config["pixit"]
        }
        v2g_path = "./v2g_config.json"
        with open(v2g_path, "w", encoding="utf-8") as fp:
            json.dump(v2g_config, fp, indent=4)
        slac_config = {
            "timer": {},
            "threshold": {}
        }
        for k, v in test_config["slac"].items():
            if ("C_" == k[:2] ):
                slac_config["threshold"][k] = v
            else:
                slac_config["timer"][k] = v
        slac_path = "./slac_config.json"
        with open(slac_path, "w", encoding="utf-8") as fp:
            json.dump(slac_config, fp, indent=4)
        return v2g_path, slac_path

class SummaryViewSet(viewsets.GenericViewSet):
    queryset = MessageType.objects.all()
    serializer_class = MessageSerializer

    def list(self, request):
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data, status.HTTP_200_OK)