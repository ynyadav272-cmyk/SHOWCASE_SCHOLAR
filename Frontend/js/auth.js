// API Base URL - Use Render production URL or localhost for development
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://your-backend-service.onrender.com/api'; // Replace with your actual Render service URL

// Authentication functions
const Auth = {
    // Store token in localStorage
    setToken(token) {
        localStorage.setItem('token', token);
    },

    // Get token from localStorage
    getToken() {
        return localStorage.getItem('token');
    },

    // Store user data in localStorage
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Get user data from localStorage
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is logged in
    isAuthenticated() {
        return this.getToken() !== null;
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    },

    // Register new user
    async register(name, email, password, role = 'student') {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Store token and user data
            this.setToken(data.token);
            this.setUser(data.user);

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Login user
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and user data
            this.setToken(data.token);
            this.setUser(data.user);

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get current user (verify token)
    async getCurrentUser() {
        try {
            const token = this.getToken();
            if (!token) {
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                this.logout();
                return null;
            }

            const user = await response.json();
            this.setUser(user);
            return user;
        } catch (error) {
            this.logout();
            return null;
        }
    }
};