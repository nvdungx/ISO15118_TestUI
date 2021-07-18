#!/bin/bash

NAME='v2g_testui'
FRONTENDDIR=/home/pi/testui/frontend/testui/dist

exec http-server --host 0.0.0.0 $FRONTENDDIR
