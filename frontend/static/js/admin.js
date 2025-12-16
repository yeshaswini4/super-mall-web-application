// Admin Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    if (!authService.hasRole('admin')) {
        alert('Access denied. Admin only.');
        window.location.href = 'index.html';
        return;
    }

    loadDashboardData();
});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    event.target.classList.add('active');

    // Load section data
    if (sectionId === 'categories') loadCategories();
    if (sectionId === 'floors') loadFloors();
    if (sectionId === 'shops') loadShops();
    if (sectionId === 'offers') loadOffers();
    if (sectionId === 'users') loadUsers();
    if (sectionId === 'logs') loadLogs();
}

async function loadDashboardData() {
    // Mock data - replace with API calls
    document.getElementById('totalShops').textContent = '24';
    document.getElementById('totalOffers').textContent = '15';
    document.getElementById('totalProducts').textContent = '156';
    document.getElementById('totalUsers').textContent = '89';
}

async function loadCategories() {
    const tbody = document.querySelector('#categoriesTable tbody');
    const mockCategories = [
        { id: 1, name: 'Fashion', icon: '👗' },
        { id: 2, name: 'Electronics', icon: '📱' },
        { id: 3, name: 'Grocery', icon: '🛒' }
    ];

    tbody.innerHTML = mockCategories.map(cat => `
        <tr>
            <td>${cat.id}</td>
            <td>${cat.name}</td>
            <td>${cat.icon}</td>
            <td>
                <button class="btn" onclick="editCategory(${cat.id})">Edit</button>
                <button class="btn" onclick="deleteCategory(${cat.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function loadFloors() {
    const tbody = document.querySelector('#floorsTable tbody');
    const mockFloors = [
        { id: 1, number: 'Ground Floor', description: 'Main entrance level' },
        { id: 2, number: 'First Floor', description: 'Fashion & Apparel' },
        { id: 3, number: 'Second Floor', description: 'Electronics & Gadgets' }
    ];

    tbody.innerHTML = mockFloors.map(floor => `
        <tr>
            <td>${floor.id}</td>
            <td>${floor.number}</td>
            <td>${floor.description}</td>
            <td>
                <button class="btn" onclick="editFloor(${floor.id})">Edit</button>
                <button class="btn" onclick="deleteFloor(${floor.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function loadShops() {
    const tbody = document.querySelector('#shopsTable tbody');
    const mockShops = [
        { id: 1, name: 'Tech World', category: 'Electronics', floor: 'Second Floor', status: 'Active' },
        { id: 2, name: 'Fashion Hub', category: 'Fashion', floor: 'First Floor', status: 'Active' }
    ];

    tbody.innerHTML = mockShops.map(shop => `
        <tr>
            <td>${shop.id}</td>
            <td>${shop.name}</td>
            <td>${shop.category}</td>
            <td>${shop.floor}</td>
            <td>${shop.status}</td>
            <td>
                <button class="btn" onclick="approveShop(${shop.id})">Approve</button>
                <button class="btn" onclick="deleteShop(${shop.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function loadOffers() {
    const tbody = document.querySelector('#offersTable tbody');
    const mockOffers = [
        { id: 1, shop: 'Tech World', discount: '20%', validUntil: '2025-12-31' },
        { id: 2, shop: 'Fashion Hub', discount: '30%', validUntil: '2025-11-30' }
    ];

    tbody.innerHTML = mockOffers.map(offer => `
        <tr>
            <td>${offer.id}</td>
            <td>${offer.shop}</td>
            <td>${offer.discount}</td>
            <td>${offer.validUntil}</td>
            <td>
                <button class="btn" onclick="deleteOffer(${offer.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function loadUsers() {
    const tbody = document.querySelector('#usersTable tbody');
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'merchant', status: 'Pending' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', status: 'Active' }
    ];

    tbody.innerHTML = mockUsers.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td>
                <button class="btn" onclick="approveUser(${user.id})">Approve</button>
                <button class="btn" onclick="blockUser(${user.id})">Block</button>
            </td>
        </tr>
    `).join('');
}

async function loadLogs() {
    const tbody = document.querySelector('#logsTable tbody');
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');

    tbody.innerHTML = logs.slice(-20).reverse().map(log => `
        <tr>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
            <td>${log.actorId} (${log.actorRole})</td>
            <td>${log.action}</td>
            <td>${log.targetType} #${log.targetId}</td>
            <td>${JSON.stringify(log.details)}</td>
        </tr>
    `).join('');
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Form handlers
document.getElementById('categoryForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('categoryName').value,
        icon: document.getElementById('categoryIcon').value
    };
    authService.logAction('create', 'admin', 'category', Date.now(), data);
    alert('Category created!');
    closeModal('categoryModal');
    loadCategories();
});

document.getElementById('floorForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        number: document.getElementById('floorNumber').value,
        description: document.getElementById('floorDesc').value
    };
    authService.logAction('create', 'admin', 'floor', Date.now(), data);
    alert('Floor created!');
    closeModal('floorModal');
    loadFloors();
});

// CRUD functions
function deleteCategory(id) {
    if (confirm('Delete this category?')) {
        authService.logAction('delete', 'admin', 'category', id);
        loadCategories();
    }
}

function deleteFloor(id) {
    if (confirm('Delete this floor?')) {
        authService.logAction('delete', 'admin', 'floor', id);
        loadFloors();
    }
}

function approveShop(id) {
    authService.logAction('approve', 'admin', 'shop', id);
    alert('Shop approved!');
    loadShops();
}

function deleteShop(id) {
    if (confirm('Delete this shop?')) {
        authService.logAction('delete', 'admin', 'shop', id);
        loadShops();
    }
}

function deleteOffer(id) {
    if (confirm('Delete this offer?')) {
        authService.logAction('delete', 'admin', 'offer', id);
        loadOffers();
    }
}

function approveUser(id) {
    authService.logAction('approve', 'admin', 'user', id);
    alert('User approved!');
    loadUsers();
}

function blockUser(id) {
    if (confirm('Block this user?')) {
        authService.logAction('block', 'admin', 'user', id);
        loadUsers();
    }
}
