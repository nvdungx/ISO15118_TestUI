#!/bin/bash

cp ./django_start.sh ../venv/bin/
cp ./http_start.sh ../venv/bin/
chmod 777 ../venv/bin/django_start.sh
chmod 777 ../venv/bin/http_start.sh
cp django_backend.service /etc/systemd/system/
cp http_server.service /etc/systemd/system/
systemctl enable django_backend.service
systemctl enable http_server.service
systemctl start django_backend.service
systemctl start http_server.service