@echo off
echo Starting SuperMall System...
echo.

python manage.py makemigrations
python manage.py migrate

echo Creating admin user...
python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supermall.settings')
django.setup()
from accounts.models import User
if not User.objects.filter(username='yeshaswini').exists():
    User.objects.create_superuser('yeshaswini', 'yeshaswini234@gmail.com', 'premaganesh', role='admin')
    print('Admin user created')
else:
    print('Admin user already exists')
"

echo Populating data...
python manage.py populate_comprehensive_data

echo.
echo ========================================
echo SuperMall System Ready!
echo Frontend: http://127.0.0.1:8000/
echo Admin: yeshaswini / premaganesh
echo ========================================
echo.

python manage.py runserver 127.0.0.1:8000