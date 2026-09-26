import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logAudit } from '../services/auditService.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'rentalproof_default_jwt_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const assignedRole = ['landlord', 'tenant', 'service_provider', 'admin'].includes(role) ? role : 'tenant';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: assignedRole,
    });

    const token = generateToken(user._id);

    await logAudit({
      user: user._id,
      action: 'User Registered',
      entity: 'User',
      entityId: user._id,
      description: `New user registered with role: ${assignedRole}`,
      req,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact administrator.' });
    }

    const token = generateToken(user._id);

    await logAudit({
      user: user._id,
      action: 'User Logged In',
      entity: 'User',
      entityId: user._id,
      description: `User ${user.email} authenticated successfully`,
      req,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    1-Click Demo Login (Auto provisions demo accounts if not seeded)
// @route   POST /api/auth/demo
// @access  Public
export const demoAuth = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['landlord', 'tenant', 'service_provider', 'admin'];
    const targetRole = validRoles.includes(role) ? role : 'tenant';

    const demoTemplates = {
      landlord: {
        name: 'Sarah Jenkins (Demo Landlord)',
        email: 'landlord@rentalproof.com',
        phone: '+1 (555) 234-5678',
        role: 'landlord',
      },
      tenant: {
        name: 'Marcus Vance (Demo Tenant)',
        email: 'tenant@rentalproof.com',
        phone: '+1 (555) 876-5432',
        role: 'tenant',
      },
      service_provider: {
        name: 'Apex Handyman Services',
        email: 'service@rentalproof.com',
        phone: '+1 (555) 345-6789',
        role: 'service_provider',
      },
      admin: {
        name: 'Platform Administrator',
        email: 'admin@rentalproof.com',
        phone: '+1 (555) 999-0000',
        role: 'admin',
      },
    };

    const template = demoTemplates[targetRole];
    let user = await User.findOne({ email: template.email });

    if (!user) {
      user = await User.create({
        ...template,
        password: 'Password123!',
      });
    }

    const token = generateToken(user._id);

    await logAudit({
      user: user._id,
      action: 'Demo Login',
      entity: 'User',
      entityId: user._id,
      description: `User authenticated via 1-click Demo mode as ${targetRole}`,
      req,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    await logAudit({
      user: user._id,
      action: 'Profile Updated',
      entity: 'User',
      entityId: user._id,
      description: 'User updated personal profile information',
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    await logAudit({
      user: user._id,
      action: 'Password Changed',
      entity: 'User',
      entityId: user._id,
      description: 'User successfully changed account password',
      req,
    });

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
