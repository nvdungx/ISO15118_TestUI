python -m venv venv
pip install -r requirement.txt
pip freeze > requirement.txt
python manage.py startporject <project> .
python manage.py startapp <app>
python manage.py createsupperuser
admin-user: admin-Test123456@
add <app_name> to INSTALLED_APP in setting.py
python manage.py makemigrations
python manage.py migrate

python manage.py runserver

create serializers.py <app>

pip install coverage
coverage run .\manage.py test; coverage report; coverage html


settings.py contains all the website settings, including registering any applications we create, the location of our static files, database configuration details, etc.
urls.py defines the site URL-to-view mappings. While this could contain all the URL mapping code
wsgi.py is used to help your Django application communicate with the webserver.
asgi.py is a standard for Python asynchronous web apps and servers to communicate with each other. ASGI is the asynchronous successor to WSGI and provides a standard for both asynchronous and synchronous Python apps (whereas WSGI provided a standard for synchronous apps only). It is backward-compatible with WSGI and supports multiple servers and application frameworks.

styles of HTML renderer provided by REST framework, one for dealing with HTML rendered using templates, the other for dealing with pre-rendered HTML