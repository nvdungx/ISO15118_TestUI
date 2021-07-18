#!/bin/bash
cd /home/pi
# install precondition
apt-get install -y python3 python3-pip python3-venv git-core cmake make redis nginx supervisor
# clone git
git clone https://github.com/nvdungx/testui.git
cd /home/pi/testui
# active virtual env
python3 -m venv venv
source /home/pi/testui/venv/bin/active
# install environment lib
pip3 install -r ./requirement.txt
python3 manage.py flush --noinput
# init server
python3 manage.py initdb /home/pi/HLC
python manage.py createsuperuser