#!/usr/bin/env python
import os
import sys
import subprocess

def run_migrations():
    print("Running migrations...")
    subprocess.run([sys.executable, 'manage.py', 'makemigrations'])
    subprocess.run([sys.executable, 'manage.py', 'migrate'])

def populate_data():
    print("Populating sample data...")
    subprocess.run([sys.executable, 'manage.py', 'populate_data'])

def create_superuser():
    print("Creating superuser (if not exists)...")
    try:
        subprocess.run([sys.executable, 'manage.py', 'createsuperuser', '--noinput', '--username', 'admin', '--email', 'admin@supermall.com'], check=False)
    except:
        pass

def run_server():
    print("Starting Django server...")
    subprocess.run([sys.executable, 'manage.py', 'runserver', '127.0.0.1:8000'])

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("Setting up SuperMall Backend...")
    run_migrations()
    populate_data()
    create_superuser()
    run_server()