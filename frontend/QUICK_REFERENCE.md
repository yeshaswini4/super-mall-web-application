# SuperMall - Quick Reference Guide

## 🚀 Quick Start
```bash
cd frontend
python -m http.server 8000
# Open: http://localhost:8000
```

## 🔐 Demo Login
- **Admin:** admin@supermall.com
- **Merchant:** merchant@supermall.com
- **Customer:** any email

## 📁 Key Files

| File | Purpose |
|------|---------|
| `index.html` | Home page |
| `login.html` | Login page |
| `admin_dashboard.html` | Admin panel |
| `merchant_dashboard.html` | Merchant panel |
| `shop_list.html` | Shop listing |
| `compare.html` | Product comparison |
| `offers.html` | Offers page |
| `static/js/auth.js` | Authentication logic |
| `static/js/api.js` | API service |
| `static/js/config.js` | Configuration |

## 🎯 User Flows

### Admin
```
Login → Dashboard → Manage Categories/Floors → Approve Shops → View Logs
```

### Merchant
```
Login → Create Shop → Add Products → Create Offers → Analytics
```

### Customer
```
Browse → Filter → View Product → Compare → Checkout
```

## 🔧 Configuration

Update `static/js/config.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## 📊 Features Checklist

- [x] Authentication (Login/Signup/Logout)
- [x] Admin Dashboard (Categories, Floors, Shops, Users, Logs)
- [x] Merchant Dashboard (Shop, Products, Offers)
- [x] Shop Listing (Filter by category/floor)
- [x] Product Details & Comparison
- [x] Offers Page (Filter by category/floor/discount)
- [x] Activity Logging
- [x] Responsive Design

## 🚀 Deploy

### Firebase
```bash
firebase login
firebase init hosting
firebase deploy
```

### Netlify
Drag `frontend` folder to netlify.com

## 📝 API Endpoints

```
POST /api/auth/login/
POST /api/auth/register/
GET  /api/categories/
GET  /api/floors/
GET  /api/shops/
GET  /api/products/
GET  /api/offers/
GET  /api/logs/
```

## 🧪 Testing

See `TESTING_GUIDE.md` for 30+ test cases

## 📚 Documentation

- `README.md` - Overview
- `IMPLEMENTATION_GUIDE.md` - Details
- `TESTING_GUIDE.md` - Test cases
- `DEPLOYMENT_GUIDE.md` - Deploy steps
- `FRONTEND_COMPLETE.md` - Summary

## 🎨 Tech Stack

- HTML5, CSS3, JavaScript (ES6+)
- No frameworks (Vanilla JS)
- Google Fonts (Poppins)
- Responsive design

## 📞 Support

Check console for errors
Verify all files in correct locations
Clear browser cache if needed

---

**Status:** Production Ready ✅
