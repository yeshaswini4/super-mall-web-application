@echo off
echo Updating database for delivery tracking...
python manage.py makemigrations orders
python manage.py migrate
echo Running delivery command to mark orders as delivered...
python manage.py deliver_orders
echo Done!