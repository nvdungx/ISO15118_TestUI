#!/bin/bash

NAME='v2g_testui'
DJANGODIR=/home/pi/testui
# SOCKFILE=/home/pi/testui/venv/run/daphne.sock
USER=root
GROUP=root
DJANGO_SETTINGS_MODULE=testui.settings
DJANGO_ASGI_MODULE=testui.asgi
TIMEOUT=120
PING_IDLE=5
PING_TIMEOUT=10
PORT=8000
HOST=0.0.0.0

cd $DJANGODIR
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# RUNDIR=$(dirname $SOCKFILE)
# test -d $RUNDIR || mkdir -p $RUNDIR
exec venv/bin/daphne ${DJANGO_ASGI_MODULE}:application \
--bind $HOST \
--port $PORT \
--server-name $NAME \
--websocket_timeout -1 \
--websocket_connect_timeout $TIMEOUT \
--ping-interval $PING_IDLE \
--ping-timeout $PING_TIMEOUT \
--http-timeout $TIMEOUT
# exec ../venv/bin/daphne ${DJANGO_ASGI_MODULE}:application \
# --server-name $NAME \
# --websocket_timeout -1 \
# --websocket_connect_timeout $TIMEOUT \
# --ping-interval $PING_IDLE \
# --ping-timeout $PING_TIMEOUT \
# --http-timeout $TIMEOUT \
# --unix-socket $SOCKFILE \
