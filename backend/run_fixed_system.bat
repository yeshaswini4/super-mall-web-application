@echo off
echo ========================================
echo    SuperMall Complete System Startup
echo ========================================
echo.

cd /d "%~dp0"

echo [1/6] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)
echo ✓ Python found

echo.
echo [2/6] Installing/Updating dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [3/6] Setting up database...
python manage.py makemigrations
python manage.py migrate
if errorlevel 1 (
    echo ERROR: Database migration failed
    pause
    exit /b 1
)
echo ✓ Database migrated

echo.
echo [4/6] Creating superuser...
python manage.py shell -c "from accounts.models import User; User.objects.filter(username='yeshaswini').exists() or User.objects.create_superuser('yeshaswini', 'yeshaswini234@gmail.com', 'premaganesh', role='admin')"
echo ✓ Admin user ready

echo.
echo [5/6] Populating sample data...
python manage.py populate_comprehensive_data
if errorlevel 1 (
    echo WARNING: Sample data population failed, continuing...
)
echo ✓ Sample data loaded

echo.
echo [6/6] Starting Django development server...
echo.
echo ========================================
echo    SuperMall System Ready!
echo ========================================
echo.
echo Frontend: http://127.0.0.1:8000/
echo Admin Panel: http://127.0.0.1:8000/admin/
echo.
echo Login Credentials:
echo - Admin: yeshaswini / premaganesh
echo - Merchant: merchant1 / merchant123
echo - Customer: customer1 / customer123
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python manage.py runserver 127.0.0.1:8000

echo.
echo Server stopped.
pause