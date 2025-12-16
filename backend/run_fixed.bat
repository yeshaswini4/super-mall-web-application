@echo off
echo Setting up SuperMall Application...

cd backend

echo Creating fresh migrations...
python manage.py makemigrations accounts
python manage.py makemigrations shops
python manage.py makemigrations products
python manage.py makemigrations orders
python manage.py makemigrations offers

echo Applying migrations...
python manage.py migrate

echo Creating superuser...
echo from accounts.models import User; User.objects.create_superuser('yeshaswini', 'yeshaswini234@gmail.com', 'yesh123') if not User.objects.filter(username='yeshaswini').exists() else None | python manage.py shell

echo Populating sample data...
python manage.py populate_data

echo Starting server...
python manage.py runserver 127.0.0.1:8000

pause