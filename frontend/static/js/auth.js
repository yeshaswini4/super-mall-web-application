class AuthService {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Try to get current user profile if session exists
        try {
            const user = await apiService.getProfile();
            this.currentUser = user;
            this.updateUI();
        } catch (error) {
            this.currentUser = null;
            this.updateUI();
        }
    }

    async login(emailOrUsername, password) {
        try {
            const response = await apiService.login(emailOrUsername, password);
            // Handle different response formats
            const user = response.user || response;
            this.currentUser = user;
            this.updateUI();
            return { success: true, user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Invalid credentials' };
        }
    }

    async register(userData) {
        try {
            const user = await apiService.register(userData);
            this.currentUser = user;
            this.updateUI();
            return { success: true, user };
        } catch (error) {
            return { success: false, message: 'Registration failed' };
        }
    }

    async logout() {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        this.currentUser = null;
        this.updateUI();
        // Force redirect to home page
        window.location.replace('index.html');
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            localStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        const profileBtn = document.getElementById('profileBtn');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userRole = document.getElementById('userRole');
        const dashboardLink = document.getElementById('dashboardLink');
        
        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (profileBtn) profileBtn.textContent = this.currentUser.first_name || this.currentUser.username;
            if (userName) userName.textContent = `${this.currentUser.first_name || ''} ${this.currentUser.last_name || ''}`.trim() || this.currentUser.username;
            if (userEmail) userEmail.textContent = this.currentUser.email;
            if (userRole) userRole.textContent = this.currentUser.role?.toUpperCase() || 'CUSTOMER';
            
            if (dashboardLink) {
                const role = this.currentUser.role || 'customer';
                dashboardLink.href = `${role}_dashboard.html`;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (userMenu) userMenu.style.display = 'none';
        }
        
        if (profileBtn) {
            profileBtn.onclick = () => {
                const dropdown = document.getElementById('profileDropdown');
                if (dropdown) {
                    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                }
            };
        }
        
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('profileDropdown');
            const profileBtn = document.getElementById('profileBtn');
            if (dropdown && profileBtn && !profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUserRole() {
        return this.currentUser?.role || 'customer';
    }

    hasRole(role) {
        return this.getUserRole() === role;
    }

    requireRole(role) {
        if (!this.isAuthenticated() || !this.hasRole(role)) {
            alert('Access denied. Insufficient permissions.');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
}

const authService = new AuthService();
