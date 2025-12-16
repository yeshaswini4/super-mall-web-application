@echo off
echo ========================================
echo    SuperMall - Complete Setup Script
echo ========================================
echo.

echo [1/5] Installing Python dependencies...
pip install -r requirements.txt

echo.
echo [2/5] Creating database migrations...
python manage.py makemigrations accounts shops products orders offers

echo.
echo [3/5] Applying migrations...
python manage.py migrate

echo.
echo [4/5] Populating sample data...
python manage.py populate_data

echo.
echo [5/5] Starting Django server...
echo.
echo ========================================
echo    SuperMall is now running!
echo    Frontend: http://127.0.0.1:8000/
echo    Admin Panel: http://127.0.0.1:8000/admin/
echo    
echo    Login Credentials:
echo    Admin: yeshaswini234@gmail.com / yesh123
echo    Merchant: max_fashion@supermall.com / merchant123
echo ========================================
echo.

python manage.py runserver 127.0.0.1:8000