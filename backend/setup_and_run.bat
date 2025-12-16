@echo off
echo Setting up SuperMall Application...

echo Installing Python dependencies...
cd backend
pip install -r requirements.txt

echo Setting up database and running server...
python run_server.py

pause