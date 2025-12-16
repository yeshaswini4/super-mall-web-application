# SuperMall Testing Guide

## 🧪 Testing Strategy

### Test Levels
1. **Unit Testing** - Individual functions
2. **Integration Testing** - Module interactions
3. **User Flow Testing** - Complete workflows
4. **UI/UX Testing** - Interface and experience

## 📋 Test Cases

### 1. Authentication Module Tests

#### TC-AUTH-001: User Login
**Objective:** Verify user can login successfully
**Steps:**
1. Navigate to `login.html`
2. Enter email: `admin@supermall.com`
3. Enter password: `test123`
4. Click "Login"

**Expected Result:**
- User redirected to admin dashboard
- User data stored in localStorage
- Login action logged

**Status:** ✅ Pass / ❌ Fail

---

#### TC-AUTH-002: User Registration
**Objective:** Verify user can register
**Steps:**
1. Navigate to `signup.html`
2. Fill all fields
3. Select role: "Merchant"
4. Click "Sign Up"

**Expected Result:**
- Account created
- User redirected based on role
- Registration logged

**Status:** ✅ Pass / ❌ Fail

---

#### TC-AUTH-003: Role-Based Redirection
**Objective:** Verify correct dashboard redirection
**Steps:**
1. Login as admin → Should go to admin_dashboard.html
2. Login as merchant → Should go to merchant_dashboard.html
3. Login as customer → Should go to index.html

**Expected Result:**
- Each role redirected correctly

**Status:** ✅ Pass / ❌ Fail

---

#### TC-AUTH-004: Logout
**Objective:** Verify logout functionality
**Steps:**
1. Login as any user
2. Click "Logout"

**Expected Result:**
- User data cleared from localStorage
- Redirected to index.html
- Logout action logged

**Status:** ✅ Pass / ❌ Fail

---

### 2. Admin Module Tests

#### TC-ADMIN-001: Create Category
**Objective:** Admin can create category
**Steps:**
1. Login as admin
2. Go to Categories section
3. Click "+ Add Category"
4. Enter name: "Books"
5. Enter icon: "📚"
6. Click "Save"

**Expected Result:**
- Category added to table
- Action logged
- Success message shown

**Status:** ✅ Pass / ❌ Fail

---

#### TC-ADMIN-002: Delete Category
**Objective:** Admin can delete category
**Steps:**
1. Login as admin
2. Go to Categories section
3. Click "Delete" on any category
4. Confirm deletion

**Expected Result:**
- Category removed from table
- Action logged

**Status:** ✅ Pass / ❌ Fail

---

#### TC-ADMIN-003: Create Floor
**Objective:** Admin can create floor
**Steps:**
1. Login as admin
2. Go to Floors section
3. Click "+ Add Floor"
4. Enter details
5. Click "Save"

**Expected Result:**
- Floor added to table
- Action logged

**Status:** ✅ Pass / ❌ Fail

---

#### TC-ADMIN-004: View Logs
**Objective:** Admin can view activity logs
**Steps:**
1. Login as admin
2. Go to Activity Logs section

**Expected Result:**
- All logged actions displayed
- Shows timestamp, user, action, target

**Status:** ✅ Pass / ❌ Fail

---

#### TC-ADMIN-005: Approve User
**Objective:** Admin can approve merchant
**Steps:**
1. Login as admin
2. Go to Users section
3. Click "Approve" on pending user

**Expected Result:**
- User status changed
- Action logged

**Status:** ✅ Pass / ❌ Fail

---

### 3. Merchant Module Tests

#### TC-MERCHANT-001: Create Shop
**Objective:** Merchant can create shop
**Steps:**
1. Login as merchant
2. Go to "My Shop" section
3. Fill shop details
4. Click "Save Shop"

**Expected Result:**
- Shop details saved
- Action logged
- Success message shown

**Status:** ✅ Pass / ❌ Fail

---

#### TC-MERCHANT-002: Add Product
**Objective:** Merchant can add product
**Steps:**
1. Login as merchant
2. Go to Products section
3. Click "+ Add Product"
4. Fill product details
5. Click "Save Product"

**Expected Result:**
- Product added to table
- Action logged
- Product count updated

**Status:** ✅ Pass / ❌ Fail

---

#### TC-MERCHANT-003: Delete Product
**Objective:** Merchant can delete product
**Steps:**
1. Login as merchant
2. Go to Products section
3. Click "Delete" on product
4. Confirm deletion

**Expected Result:**
- Product removed
- Action logged
- Product count updated

**Status:** ✅ Pass / ❌ Fail

---

#### TC-MERCHANT-004: Create Offer
**Objective:** Merchant can create offer
**Steps:**
1. Login as merchant
2. Go to Offers section
3. Click "+ Create Offer"
4. Fill offer details
5. Click "Create Offer"

**Expected Result:**
- Offer added to table
- Action logged
- Offer count updated

**Status:** ✅ Pass / ❌ Fail

---

### 4. Shop Module Tests

#### TC-SHOP-001: View All Shops
**Objective:** User can view all shops
**Steps:**
1. Navigate to `shop_list.html`

**Expected Result:**
- All shops displayed
- Images loaded
- Links working

**Status:** ✅ Pass / ❌ Fail

---

#### TC-SHOP-002: Filter by Category
**Objective:** Filter shops by category
**Steps:**
1. Go to shop_list.html
2. Select "Fashion" from category filter

**Expected Result:**
- Only fashion shops displayed
- Other shops hidden

**Status:** ✅ Pass / ❌ Fail

---

#### TC-SHOP-003: Filter by Floor
**Objective:** Filter shops by floor
**Steps:**
1. Go to shop_list.html
2. Select "Ground Floor" from floor filter

**Expected Result:**
- Only ground floor shops displayed

**Status:** ✅ Pass / ❌ Fail

---

#### TC-SHOP-004: Combined Filters
**Objective:** Apply multiple filters
**Steps:**
1. Go to shop_list.html
2. Select category: "Electronics"
3. Select floor: "Second Floor"

**Expected Result:**
- Only electronics shops on 2nd floor shown

**Status:** ✅ Pass / ❌ Fail

---

### 5. Product Module Tests

#### TC-PRODUCT-001: View Product Details
**Objective:** User can view product details
**Steps:**
1. Navigate to `product_detail.html?id=1`

**Expected Result:**
- Product details displayed
- Image loaded
- Features listed
- Price shown

**Status:** ✅ Pass / ❌ Fail

---

#### TC-PRODUCT-002: Add to Compare
**Objective:** User can add product to comparison
**Steps:**
1. Go to product detail page
2. Click "Add to Compare"

**Expected Result:**
- Success message shown
- Compare badge updated
- Action logged

**Status:** ✅ Pass / ❌ Fail

---

#### TC-PRODUCT-003: Compare Products
**Objective:** User can compare products
**Steps:**
1. Add 2-3 products to comparison
2. Navigate to `compare.html`

**Expected Result:**
- Products displayed side by side
- Features compared
- Prices compared

**Status:** ✅ Pass / ❌ Fail

---

#### TC-PRODUCT-004: Remove from Compare
**Objective:** User can remove product from comparison
**Steps:**
1. Go to compare.html
2. Click "Remove" on a product

**Expected Result:**
- Product removed from comparison
- UI updated

**Status:** ✅ Pass / ❌ Fail

---

#### TC-PRODUCT-005: Compare Limit
**Objective:** Maximum 3 products can be compared
**Steps:**
1. Add 3 products to comparison
2. Try to add 4th product

**Expected Result:**
- Error message shown
- 4th product not added

**Status:** ✅ Pass / ❌ Fail

---

### 6. Offer Module Tests

#### TC-OFFER-001: View All Offers
**Objective:** User can view all offers
**Steps:**
1. Navigate to `offers.html`

**Expected Result:**
- All offers displayed
- Discount percentages shown
- Validity dates shown

**Status:** ✅ Pass / ❌ Fail

---

#### TC-OFFER-002: Filter Offers by Category
**Objective:** Filter offers by category
**Steps:**
1. Go to offers.html
2. Select category from filter

**Expected Result:**
- Only offers from selected category shown

**Status:** ✅ Pass / ❌ Fail

---

#### TC-OFFER-003: Filter by Discount
**Objective:** Filter offers by discount percentage
**Steps:**
1. Go to offers.html
2. Select "20% and above"

**Expected Result:**
- Only offers with 20%+ discount shown

**Status:** ✅ Pass / ❌ Fail

---

### 7. Logging Module Tests

#### TC-LOG-001: Login Logged
**Objective:** Login action is logged
**Steps:**
1. Login as any user
2. Login as admin
3. Check Activity Logs

**Expected Result:**
- Login action present in logs
- Correct user ID and role

**Status:** ✅ Pass / ❌ Fail

---

#### TC-LOG-002: CRUD Operations Logged
**Objective:** All CRUD operations logged
**Steps:**
1. Create/Update/Delete any entity
2. Check Activity Logs

**Expected Result:**
- Action logged with details
- Timestamp recorded

**Status:** ✅ Pass / ❌ Fail

---

### 8. UI/UX Tests

#### TC-UI-001: Responsive Design
**Objective:** Site works on mobile
**Steps:**
1. Open site on mobile device
2. Test all pages

**Expected Result:**
- Layout adapts to screen size
- All features accessible

**Status:** ✅ Pass / ❌ Fail

---

#### TC-UI-002: Navigation
**Objective:** Navigation works correctly
**Steps:**
1. Click all navigation links
2. Verify correct pages load

**Expected Result:**
- All links work
- No broken pages

**Status:** ✅ Pass / ❌ Fail

---

#### TC-UI-003: Form Validation
**Objective:** Forms validate input
**Steps:**
1. Try to submit empty forms
2. Try invalid email format

**Expected Result:**
- Validation errors shown
- Form not submitted

**Status:** ✅ Pass / ❌ Fail

---

## 🔄 Integration Test Flows

### Flow 1: Complete Merchant Journey
```
1. Register as merchant
2. Login
3. Create shop
4. Add 3 products
5. Create 2 offers
6. View analytics
7. Logout
```

**Expected:** All actions successful and logged

---

### Flow 2: Complete Customer Journey
```
1. Browse shops as guest
2. Register as customer
3. Login
4. Filter shops by category
5. View product details
6. Add 3 products to compare
7. View comparison
8. Logout
```

**Expected:** All actions successful and logged

---

### Flow 3: Complete Admin Journey
```
1. Login as admin
2. Create 2 categories
3. Create 2 floors
4. Approve merchant
5. View all shops
6. View all offers
7. Check activity logs
8. Logout
```

**Expected:** All actions successful and logged

---

## 📊 Test Results Summary

| Module | Total Tests | Passed | Failed | Pass Rate |
|--------|-------------|--------|--------|-----------|
| Authentication | 4 | - | - | - |
| Admin | 5 | - | - | - |
| Merchant | 4 | - | - | - |
| Shop | 4 | - | - | - |
| Product | 5 | - | - | - |
| Offer | 3 | - | - | - |
| Logging | 2 | - | - | - |
| UI/UX | 3 | - | - | - |
| **TOTAL** | **30** | **-** | **-** | **-%** |

## 🐛 Bug Report Template

```
Bug ID: BUG-XXX
Title: [Brief description]
Severity: Critical / High / Medium / Low
Module: [Module name]
Steps to Reproduce:
1. 
2. 
3. 

Expected Result:
Actual Result:
Screenshots:
Browser: 
OS:
```

## ✅ Test Execution Checklist

- [ ] All authentication tests passed
- [ ] All admin tests passed
- [ ] All merchant tests passed
- [ ] All shop tests passed
- [ ] All product tests passed
- [ ] All offer tests passed
- [ ] All logging tests passed
- [ ] All UI/UX tests passed
- [ ] Integration flows tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing done
- [ ] Performance acceptable

---

**Tester:** _______________
**Date:** _______________
**Version:** 1.0
