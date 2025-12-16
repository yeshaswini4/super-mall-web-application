# SuperMall - E-commerce Web Application

## Project Structure
```
supermall/
├── frontend/           # HTML, CSS, JavaScript files
│   ├── index.html     # Homepage
│   ├── login.html     # Login page
│   ├── signup.html    # Registration page
│   ├── shop_*.html    # Individual shop pages
│   └── static/        # CSS, JS, images
└── backend/           # Django backend with SQLite
    ├── manage.py      # Django management
    ├── run_fixed.bat  # Setup and run script
    └── apps/          # Django applications
```

## Quick Start

1. **Start Backend Server:**
   ```bash
   cd backend
   run_fixed.bat
   ```

2. **Access Application:**
   - Frontend: http://127.0.0.1:8000/
   - Admin Panel: http://127.0.0.1:8000/admin/

## Features
- ✅ Complete frontend with 15+ shop pages
- ✅ Django REST API backend
- ✅ SQLite database with sample data
- ✅ User authentication (Admin/Merchant/Customer)
- ✅ Cart and wishlist functionality
- ✅ Product comparison and offers

## Login Credentials
See `backend/CREDENTIALS.md` for all login details.

## Documentation
- Setup Guide: `backend/README_SETUP.md`
- All backend files contained in `backend/` directory