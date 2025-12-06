const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // For generating reset tokens

const dataPath = path.join(__dirname, '../data/portfolio.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const RESET_TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds

// Helper function to read data
async function readData() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        const parsedData = JSON.parse(data);
        
        // Ensure all required arrays exist
        if (!parsedData.users) {
            parsedData.users = [];
        }
        if (!parsedData.students) {
            parsedData.students = [];
        }
        if (!parsedData.projects) {
            parsedData.projects = [];
        }
        if (!parsedData.achievements) {
            parsedData.achievements = [];
        }
        if (!parsedData.contacts) {
            parsedData.contacts = [];
        }
        if (!parsedData.resetTokens) {
            parsedData.resetTokens = [];
        }
        
        return parsedData;
    } catch (error) {
        return {
            students: [],
            projects: [],
            achievements: [],
            contacts: [],
            users: [],
            resetTokens: []
        };
    }
}

// Helper function to write data
async function writeData(data) {
    const dataDir = path.dirname(dataPath);
    await fs.mkdir(dataDir, { recursive: true });
    
    // Ensure all arrays exist before writing
    if (!data.users) data.users = [];
    if (!data.resetTokens) data.resetTokens = [];
    
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Generate reset token
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Clean expired reset tokens
async function cleanExpiredTokens() {
    const data = await readData();
    const now = Date.now();
    
    if (data.resetTokens && Array.isArray(data.resetTokens)) {
        data.resetTokens = data.resetTokens.filter(
            token => token.expiresAt > now
        );
        await writeData(data);
    }
}

// Register new user (existing code)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const data = await readData();

        if (!data.users || !Array.isArray(data.users)) {
            data.users = [];
        }

        const existingUser = data.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let newId = 1;
        if (data.users.length > 0) {
            const maxId = Math.max(...data.users.map(u => u.id || 0));
            newId = maxId + 1;
        }

        const newUser = {
            id: newId,
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            createdAt: new Date().toISOString()
        };

        data.users.push(newUser);
        await writeData(data);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Login user (existing code)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const data = await readData();

        if (!data.users || !Array.isArray(data.users)) {
            data.users = [];
        }

        const user = data.users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Forgot Password - Request password reset
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const data = await readData();

        if (!data.users || !Array.isArray(data.users)) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = data.users.find(u => u.email === email);
        
        // Always return success message for security (don't reveal if email exists)
        if (!user) {
            return res.json({
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        // Clean expired tokens
        await cleanExpiredTokens();

        // Generate reset token
        const resetToken = generateResetToken();
        const expiresAt = Date.now() + RESET_TOKEN_EXPIRY;

        // Store reset token
        if (!data.resetTokens) {
            data.resetTokens = [];
        }

        // Remove any existing tokens for this user
        data.resetTokens = data.resetTokens.filter(
            token => token.userId !== user.id
        );

        // Add new reset token
        data.resetTokens.push({
            userId: user.id,
            token: resetToken,
            expiresAt: expiresAt,
            createdAt: new Date().toISOString()
        });

        await writeData(data);

        // In a real application, you would send an email here with the reset link
        // For now, we'll return the token (in production, remove this)
        res.json({
            message: 'If an account with that email exists, a password reset link has been sent.',
            resetToken: resetToken, // Remove this in production - only for testing
            resetLink: `http://localhost:8000/reset-password.html?token=${resetToken}` // Remove in production
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Reset Password - Reset password with token
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const data = await readData();

        // Clean expired tokens
        await cleanExpiredTokens();

        if (!data.resetTokens || !Array.isArray(data.resetTokens)) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Find the reset token
        const resetTokenData = data.resetTokens.find(
            t => t.token === token && t.expiresAt > Date.now()
        );

        if (!resetTokenData) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Find the user
        if (!data.users || !Array.isArray(data.users)) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = data.users.find(u => u.id === resetTokenData.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        user.password = hashedPassword;
        user.updatedAt = new Date().toISOString();

        // Remove used reset token
        data.resetTokens = data.resetTokens.filter(
            t => t.token !== token
        );

        await writeData(data);

        res.json({
            message: 'Password reset successfully. You can now login with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Verify Reset Token - Check if token is valid
exports.verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const data = await readData();

        // Clean expired tokens
        await cleanExpiredTokens();

        if (!data.resetTokens || !Array.isArray(data.resetTokens)) {
            return res.status(400).json({ valid: false, error: 'Invalid token' });
        }

        const resetTokenData = data.resetTokens.find(
            t => t.token === token && t.expiresAt > Date.now()
        );

        if (!resetTokenData) {
            return res.status(400).json({ valid: false, error: 'Invalid or expired token' });
        }

        res.json({ valid: true, message: 'Token is valid' });
    } catch (error) {
        console.error('Verify reset token error:', error);
        res.status(500).json({ valid: false, error: error.message });
    }
};

// Get current user (existing code)
exports.getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const data = await readData();

        if (!data.users || !Array.isArray(data.users)) {
            data.users = [];
        }

        const user = data.users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to verify token (existing code)
exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};