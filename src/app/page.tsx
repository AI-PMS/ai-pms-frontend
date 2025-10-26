'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  PlusCircle, 
  BarChart3, 
  Users, 
  Shield,
  VideoIcon, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  Eye,
  EyeOff,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Menu,
  X,
  Home,
  Activity,
  MessageCircle,
  Zap,
  Clock,
  UserPlus,
  FileCheck,
  Save,
  RefreshCw,
  Scale,
  Camera,
  Bell,
  ClipboardList,
  DownloadCloud,
  UploadCloud,
  BarChart,
  PieChart,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Network,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  Radio,
  Megaphone,
  Siren,
  Stethoscope,
  Heart,
  Pill,
  Ambulance,
  Car,
  Truck,
  Plane,
  Ship,
  Train,
  Bus,
  Award,
  Star,
  Crown,
  Flag,
  Globe,
  Map,
  Compass,
  Navigation,
  Target,
  Crosshair,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  ShieldQuestion,
  ShieldX,
  Skull,
  Ghost,
  Bug,
  Bird,
  Cat,
  Dog,
  Fish,
  TreePine,
  TreeDeciduous,
  Flower,
  Leaf,
  Sprout,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  Sun,
  Moon,
  Users as OfficersIcon,
  CalendarDays,
  Clipboard
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

// Import modal components
import PrisonerRegistrationModal from './components/PrisonerRegistrationModal';
import VisitorRegistrationModal from './components/VisitorRegistrationModal';
import PrisonerEditModal from './components/PrisonerEditModal';
import VisitorEditModal from './components/VisitorEditModal';
import CellRegistrationModal from './components/CellRegistrationModal';
import AIChatBot from './components/AIChatBot';
import OfficerRegistrationModal from './components/OfficerRegistrationModal';
import OfficerEditModal from './components/OfficerEditModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-pms-backend.onrender.com/api/v1';

// Validation functions
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

const validateEmail = (email: string): string | null => {
  if (!EMAIL_REGEX.test(email)) {
    return 'Invalid email format';
  }
  
  const domain = email.split('@')[1].toLowerCase();
  const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 
                        'icloud.com', 'aol.com', 'protonmail.com', 'police.gov.gh', 'security.gov.gh'];
  
  if (!commonDomains.some(d => domain.endsWith(d))) {
    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
      return 'Invalid email domain';
    }
  }
  
  return null;
};

const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&)';
  }
  
  return null;
};

// Types
interface User {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'officer' | 'supervisor';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  institution_name: string;
  institution_code: string;
  created_at: string;
  last_login?: string;
}

interface Prisoner {
  id: string;
  prisoner_id: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  gender: 'male' | 'female';
  date_of_birth: string;
  nationality: string;
  id_number: string;
  crime: string;
  sentence_duration: string;
  date_admitted: string;
  expected_release_date?: string;
  status: 'remand' | 'convicted' | 'released' | 'transferred';
  cell_id: string;
  medical_conditions?: string[];
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Visitor {
  id: string;
  prisoner_id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  id_number: string;
  phone: string;
  visit_date: string;
  purpose: string;
  items_brought?: string[];
  approved: boolean;
  approved_by?: string;
  created_by: string;
  created_at: string;
  prisoner_name?: string;
  prisoner_number?: string;
}

interface Cell {
  id: string;
  cell_number: string;
  block: string;
  capacity: number;
  current_occupancy: number;
  status: 'available' | 'full' | 'maintenance';
  created_by: string;
  created_at: string;
  occupancy_percentage?: number;
}

interface Officer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
}

interface OfficerDuty {
  id: string;
  officer_id: string;
  date: string;
  shift: string;
  block_assigned: string;
  notes?: string;
  created_at: string;
  officer_name: string;
  officer_phone: string;
  officer_email: string;
}

interface SystemStatus {
  user_count: number;
  registration_allowed: boolean;
  first_user_registration: boolean;
}

interface DashboardSummary {
  total_prisoners: number;
  prisoners_this_week: number;
  visitors_today: number;
  visitors_this_week: number;
  total_cells: number;
  officers_on_duty_today: number;
}

const PrisonManagementApp = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Form States
  const [loginForm, setLoginForm] = useState({ 
    email: '', 
    password: '',
    showPassword: false
  });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    institution_name: '',
    institution_code: '',
    showPassword: false,
    showConfirmPassword: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Main App States
  const [currentView, setCurrentView] = useState('dashboard');
  const [prisoners, setPrisoners] = useState<Prisoner[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);
  const [officerDuties, setOfficerDuties] = useState<OfficerDuty[]>([]);
  const [availableOfficers, setAvailableOfficers] = useState<Officer[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  // Modal States
  const [showPrisonerForm, setShowPrisonerForm] = useState(false);
  const [showVisitorForm, setShowVisitorForm] = useState(false);
  const [showCellForm, setShowCellForm] = useState(false);
  const [showOfficerForm, setShowOfficerForm] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showPrisonerEditModal, setShowPrisonerEditModal] = useState(false);
  const [showVisitorEditModal, setShowVisitorEditModal] = useState(false);
  const [showOfficerEditModal, setShowOfficerEditModal] = useState(false);
  
  // Selected items for editing
  const [selectedPrisoner, setSelectedPrisoner] = useState<Prisoner | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [selectedOfficerDuty, setSelectedOfficerDuty] = useState<OfficerDuty | null>(null);
  const [selectedPrisonerForCall, setSelectedPrisonerForCall] = useState<Prisoner | null>(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');

  // Enhanced mobile detection with viewport consideration
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Add mobile-specific class to body for global CSS adjustments
      if (mobile) {
        document.body.classList.add('mobile-device');
        document.body.classList.remove('desktop-device');
      } else {
        document.body.classList.add('desktop-device');
        document.body.classList.remove('mobile-device');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Set viewport meta tag dynamically for better mobile control
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('mobile-device', 'desktop-device');
    };
  }, []);

  // Check authentication and system status on mount
  useEffect(() => {
    checkAuth();
    checkSystemStatus();
  }, []);

  // Check system status to determine if registration should be shown
  const checkSystemStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/system-status`);
      const result = await response.json();
      
      if (result.success) {
        setSystemStatus(result.data);
        setShowRegister(result.data.first_user_registration);
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  };

  // Enhanced authentication check
  const checkAuth = async () => {
    try {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      console.log('Auth check - Token exists:', !!savedToken);
      console.log('Auth check - User exists:', !!savedUser);

      if (savedToken && savedUser) {
        setToken(savedToken);
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Verify token with backend
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${savedToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Auth verification successful:', result);
          
          if (result.success || result.data) {
            setUser(result.data || result);
            setIsAuthenticated(true);
            
            // Check system status to update register form visibility
            const statusResponse = await fetch(`${API_BASE_URL}/auth/system-status`);
            const statusResult = await statusResponse.json();
            
            if (statusResult.success) {
              setSystemStatus(statusResult.data);
              setShowRegister(statusResult.data.first_user_registration);
            }

            // AUTO-REDIRECT TO DASHBOARD IF AUTHENTICATED
            setCurrentView('dashboard');
            await loadDashboardData(); // Load data immediately
          }
        } else {
          console.log('Token verification failed, clearing storage');
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } else {
        console.log('No saved credentials found');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced API Helper Function
  const apiCall = async (endpoint: string, options: any = {}) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      // Add authorization header if token exists
      const currentToken = token || localStorage.getItem('token');
      if (currentToken) {
        headers['Authorization'] = `Bearer ${currentToken}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        ...options
      });

      let result;
      try {
        result = await response.json();
      } catch (e) {
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        // If unauthorized, clear local storage
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
          setCurrentView('dashboard');
        }
        throw new Error(result.detail || result.message || `API call failed with status ${response.status}`);
      }

      return result;
    } catch (error: any) {
      console.error('API Error:', error);
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'API call failed',
        duration: 5000
      }]);
      throw error;
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user, token]);

  // Validation functions for forms
  const validateLoginForm = () => {
    const errors: Record<string, string> = {};
    
    // Email validation
    const emailError = validateEmail(loginForm.email);
    if (emailError) errors.email = emailError;
    if (!loginForm.email) errors.email = 'Email is required';
    
    // Password validation
    if (!loginForm.password) errors.password = 'Password is required';
    else if (loginForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};
    
    // Email validation
    const emailError = validateEmail(registerForm.email);
    if (emailError) errors.email = emailError;
    if (!registerForm.email) errors.email = 'Email is required';
    
    // Password validation
    const passwordError = validatePassword(registerForm.password);
    if (passwordError) errors.password = passwordError;
    if (!registerForm.password) errors.password = 'Password is required';
    
    // Confirm password validation
    if (!registerForm.confirmPassword) errors.confirmPassword = 'Confirm password is required';
    else if (registerForm.password !== registerForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    // Required fields validation
    if (!registerForm.first_name) errors.first_name = 'First name is required';
    if (!registerForm.last_name) errors.last_name = 'Last name is required';
    if (!registerForm.phone) errors.phone = 'Phone number is required';
    if (!registerForm.institution_name) errors.institution_name = 'Institution name is required';
    if (!registerForm.institution_code) errors.institution_code = 'Institution code is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Authentication Functions
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password,
          first_name: registerForm.first_name,
          last_name: registerForm.last_name,
          phone: registerForm.phone,
          institution_name: registerForm.institution_name,
          institution_code: registerForm.institution_code
        })
      });

      if (result.success) {
        const { user: userData, access_token } = result.data;
        
        // Set state first
        setUser(userData);
        setToken(access_token);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Update system status after registration
        await checkSystemStatus();

        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: result.message || 'Registration successful!',
          duration: 3000
        }]);

        // FORCE REDIRECT TO DASHBOARD - Clear any pending states
        setTimeout(() => {
          setCurrentView('dashboard');
          // Force reload dashboard data
          loadDashboardData();
        }, 100);
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Registration failed',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });

      console.log('Login response:', result);

      if (result.success) {
        const { user: userData, access_token } = result.data;
        
        // Set state first
        setUser(userData);
        setToken(access_token);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));

        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: result.message || `Welcome back, ${userData.first_name}!`,
          duration: 3000
        }]);

        // IMMEDIATE REDIRECT TO DASHBOARD
        setCurrentView('dashboard');
        
        // Force reload dashboard data
        await loadDashboardData();

        // Clear login form
        setLoginForm({ 
          email: '', 
          password: '',
          showPassword: false
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Login failed. Please check your credentials.',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setNotifications(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: 'info',
      message: 'Logged out successfully',
      duration: 3000
    }]);
  };

  // Data Loading Functions
  const loadDashboardData = async () => {
    try {
      // Load dashboard summary
      const summaryResult = await apiCall('/reports/dashboard-summary');
      if (summaryResult) {
        setDashboardSummary(summaryResult);
      }

      // Load prisoners
      const prisonersResult = await apiCall('/prisoners');
      if (Array.isArray(prisonersResult)) {
        setPrisoners(prisonersResult);
      }

      // Load visitors
      const visitorsResult = await apiCall('/visitors');
      if (Array.isArray(visitorsResult)) {
        setVisitors(visitorsResult);
      }

      // Load cells
      const cellsResult = await apiCall('/cells');
      if (Array.isArray(cellsResult)) {
        setCells(cellsResult);
      }

      // Load officer duties
      await loadOfficerDuties();
      
      // Load available officers
      await loadAvailableOfficers();

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  // Officer Duty Management Functions
  const loadOfficerDuties = async () => {
    try {
      const dutiesResult = await apiCall('/officers/duty');
      if (Array.isArray(dutiesResult)) {
        setOfficerDuties(dutiesResult);
      }
    } catch (error) {
      console.error('Failed to load officer duties:', error);
    }
  };

  const loadAvailableOfficers = async () => {
    try {
      const officersResult = await apiCall('/officers/available');
      if (Array.isArray(officersResult)) {
        setAvailableOfficers(officersResult);
      }
    } catch (error) {
      console.error('Failed to load available officers:', error);
    }
  };

  const handleCreateOfficerDuty = async (dutyData: any) => {
  setIsLoading(true);

  try {
    const result = await apiCall('/officers/duty', {
      method: 'POST',
      body: JSON.stringify(dutyData)
    });

    if (result.message) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'success',
        message: 'Officer duty assigned successfully!',
        duration: 3000
      }]);
      
      setShowOfficerForm(false);
      loadOfficerDuties();
      loadDashboardData();
    }
  } catch (error: any) {
    setNotifications(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: 'error',
      message: error.message || 'Failed to assign officer duty',
      duration: 5000
    }]);
  } finally {
    setIsLoading(false);
  }
};

  const handleUpdateOfficerDuty = async (dutyId: string, dutyData: any) => {
    setIsLoading(true);

    try {
      const result = await apiCall(`/officers/duty/${dutyId}`, {
        method: 'PUT',
        body: JSON.stringify(dutyData)
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Officer duty updated successfully!',
          duration: 3000
        }]);
        
        setShowOfficerEditModal(false);
        setSelectedOfficerDuty(null);
        loadOfficerDuties();
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to update officer duty',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOfficerDuty = async (dutyId: string) => {
    if (!confirm('Are you sure you want to delete this duty assignment?')) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiCall(`/officers/duty/${dutyId}`, {
        method: 'DELETE'
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Duty assignment deleted successfully!',
          duration: 3000
        }]);
        
        loadOfficerDuties();
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to delete duty assignment',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Prisoner Management Functions
  const handleCreatePrisoner = async (prisonerData: any) => {
    setIsLoading(true);

    try {
      const result = await apiCall('/prisoners', {
        method: 'POST',
        body: JSON.stringify(prisonerData)
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Prisoner registered successfully!',
          duration: 3000
        }]);
        
        setShowPrisonerForm(false);
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to register prisoner',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrisoner = async (prisonerId: string, prisonerData: any) => {
    setIsLoading(true);

    try {
      const result = await apiCall(`/prisoners/${prisonerId}`, {
        method: 'PUT',
        body: JSON.stringify(prisonerData)
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Prisoner updated successfully!',
          duration: 3000
        }]);
        
        setShowPrisonerEditModal(false);
        setSelectedPrisoner(null);
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to update prisoner',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrisoner = async (prisonerId: string) => {
    if (!confirm('Are you sure you want to delete this prisoner record?')) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiCall(`/prisoners/${prisonerId}`, {
        method: 'DELETE'
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Prisoner record deleted successfully!',
          duration: 3000
        }]);
        
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to delete prisoner',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Visitor Management Functions
  const handleCreateVisitor = async (visitorData: any) => {
    setIsLoading(true);

    try {
      const result = await apiCall('/visitors', {
        method: 'POST',
        body: JSON.stringify(visitorData)
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Visitor registered successfully!',
          duration: 3000
        }]);
        
        setShowVisitorForm(false);
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to register visitor',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVisitor = async (visitorId: string, visitorData: any) => {
    setIsLoading(true);

    try {
      const result = await apiCall(`/visitors/${visitorId}`, {
        method: 'PUT',
        body: JSON.stringify(visitorData)
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Visitor updated successfully!',
          duration: 3000
        }]);
        
        setShowVisitorEditModal(false);
        setSelectedVisitor(null);
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to update visitor',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVisitor = async (visitorId: string) => {
    if (!confirm('Are you sure you want to delete this visitor record?')) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiCall(`/visitors/${visitorId}`, {
        method: 'DELETE'
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Visitor record deleted successfully!',
          duration: 3000
        }]);
        
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to delete visitor',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveVisitor = async (visitorId: string) => {
    setIsLoading(true);

    try {
      const result = await apiCall(`/visitors/${visitorId}/approve`, {
        method: 'PUT'
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Visitor approved successfully!',
          duration: 3000
        }]);
        
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to approve visitor',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cell Management Functions
  const handleCreateCell = async (cellData: any) => {
    setIsLoading(true);

    try {
      const result = await apiCall('/cells', {
        method: 'POST',
        body: JSON.stringify(cellData)
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Cell created successfully!',
          duration: 3000
        }]);
        
        setShowCellForm(false);
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to create cell',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCell = async (cellId: string) => {
    if (!confirm('Are you sure you want to delete this cell? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiCall(`/cells/${cellId}`, {
        method: 'DELETE'
      });

      if (result.message) {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: 'Cell deleted successfully!',
          duration: 3000
        }]);
        
        loadDashboardData();
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to delete cell',
        duration: 5000
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Report Generation Functions
  const generatePrisonersReport = async (format: 'excel' | 'pdf') => {
    try {
      const endpoint = format === 'excel' 
        ? '/reports/prisoners/excel' 
        : '/reports/prisoners/pdf';
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prisoners_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: `Prisoners report generated successfully in ${format.toUpperCase()} format!`,
          duration: 3000
        }]);
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to generate report',
        duration: 5000
      }]);
    }
  };

  const generateUniqueKey = (item: any, prefix: string, index?: number) => {
    return item?.id || item?.prisoner_id || `${prefix}-${index}-${Date.now()}`;
  };

  const generateVisitorsReport = async (format: 'excel' | 'pdf') => {
    try {
      const endpoint = '/reports/visitors/excel';
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visitors_report_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'success',
          message: `Visitors report generated successfully in Excel format!`,
          duration: 3000
        }]);
      }
    } catch (error: any) {
      setNotifications(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'error',
        message: error.message || 'Failed to generate report',
        duration: 5000
      }]);
    }
  };

  // Filter Functions
  const getFilteredPrisoners = () => {
    return prisoners.filter(prisoner => {
      const matchesSearch = searchTerm === '' || 
        prisoner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prisoner.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prisoner.prisoner_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prisoner.id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prisoner.crime.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || prisoner.status === statusFilter;
      const matchesGender = genderFilter === 'all' || prisoner.gender === genderFilter;

      return matchesSearch && matchesStatus && matchesGender;
    });
  };

  const getFilteredVisitors = () => {
    return visitors.filter(visitor => {
      const matchesSearch = searchTerm === '' || 
        visitor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visitor.prisoner_name && visitor.prisoner_name.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });
  };

  const getFilteredOfficerDuties = () => {
    return officerDuties.filter(duty => {
      const matchesSearch = searchTerm === '' || 
        (duty.officer_name && duty.officer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        duty.block_assigned.toLowerCase().includes(searchTerm.toLowerCase()) ||
        duty.shift.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesShift = shiftFilter === 'all' || duty.shift === shiftFilter;

      return matchesSearch && matchesShift;
    });
  };

  // Enhanced Mobile-Optimized Input Component
  const MobileOptimizedInput = ({ 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    className = '', 
    ...props 
  }: any) => {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mobile-optimized-input ${className}`}
        {...props}
      />
    );
  };

  // Enhanced Mobile-Optimized TextArea Component
  const MobileOptimizedTextArea = ({ 
    value, 
    onChange, 
    placeholder, 
    className = '', 
    rows = 3,
    ...props 
  }: any) => {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`mobile-optimized-textarea ${className}`}
        {...props}
      />
    );
  };

  // Enhanced Mobile-Optimized Select Component
  const MobileOptimizedSelect = ({ 
    value, 
    onChange, 
    children, 
    className = '', 
    ...props 
  }: any) => {
    return (
      <select
        value={value}
        onChange={onChange}
        className={`mobile-optimized-select ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  };

  // Notification Component
  const NotificationSystem = () => {
    useEffect(() => {
      if (notifications.length > 0) {
        const timer = setTimeout(() => {
          setNotifications(prev => prev.slice(1));
        }, notifications[0].duration || 5000);

        return () => clearTimeout(timer);
      }
    }, [notifications]);

    return (
      <div className={`fixed z-50 space-y-2 w-full max-w-xs notification-container ${
        isMobile ? 'top-2 right-2' : 'top-4 right-4'
      }`}>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 mobile-notification ${
              notif.type === 'success' ? 'bg-green-500 text-white' :
              notif.type === 'error' ? 'bg-red-500 text-white' :
              notif.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{notif.message}</span>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="ml-2 text-white hover:opacity-75"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Login/Register Form - MOBILE OPTIMIZED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-purple-100/20 animate-pulse"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400/10 rounded-full blur-lg animate-ping"></div>
        
        <ToastContainer position="top-right" autoClose={5000} />
        <NotificationSystem />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden border border-gray-200 relative z-10"
        >
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left Side - Form */}
            <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent"
                  >
                    Prison Management System
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-sm"
                  >
                    Secure Prison Management for Ghana Security Agencies
                  </motion.p>
                </div>

                {/* Form Container - FIXED: Using regular input fields without custom components */}
                <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                  {showRegister ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Register Your Institution</h2>
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              placeholder="First Name"
                              value={registerForm.first_name}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, first_name: e.target.value }))}
                              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                formErrors.first_name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                              }`}
                              required
                            />
                            {formErrors.first_name && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Last Name"
                              value={registerForm.last_name}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, last_name: e.target.value }))}
                              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                formErrors.last_name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                              }`}
                              required
                            />
                            {formErrors.last_name && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <input
                            type="email"
                            placeholder="Official Email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                            required
                          />
                          {formErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                          )}
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            placeholder="Phone Number"
                            value={registerForm.phone}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                            required
                          />
                          {formErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                          )}
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            placeholder="Institution Name"
                            value={registerForm.institution_name}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, institution_name: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              formErrors.institution_name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                            required
                          />
                          {formErrors.institution_name && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.institution_name}</p>
                          )}
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            placeholder="Institution Code"
                            value={registerForm.institution_code}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, institution_code: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              formErrors.institution_code ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                            required
                          />
                          {formErrors.institution_code && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.institution_code}</p>
                          )}
                        </div>
                        
                        <div className="relative">
                          <input
                            type={registerForm.showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              formErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setRegisterForm(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                          >
                            {registerForm.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          {formErrors.password && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                          )}
                        </div>
                        
                        <div className="relative">
                          <input
                            type={registerForm.showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              formErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setRegisterForm(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                          >
                            {registerForm.showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          {formErrors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                          )}
                        </div>
                        
                        <motion.button
                          type="submit"
                          disabled={isLoading}
                          whileHover={{ scale: isLoading ? 1 : 1.02 }}
                          whileTap={{ scale: isLoading ? 1 : 0.98 }}
                          className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-red-700 transition-all duration-300 font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Creating Account...</span>
                            </div>
                          ) : (
                            'Register Institution'
                          )}
                        </motion.button>
                      </form>
                      {systemStatus && !systemStatus.first_user_registration && (
                        <p className="text-center mt-4 text-sm text-gray-600">
                          Already have an account?{' '}
                          <button
                            onClick={() => setShowRegister(false)}
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            Login here
                          </button>
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Login to Your Account</h2>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <input
                            type="email"
                            placeholder="Official Email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                            required
                          />
                          {formErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                          )}
                        </div>
                        
                        <div className="relative">
                          <input
                            type={loginForm.showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              formErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setLoginForm(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                          >
                            {loginForm.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          {formErrors.password && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                          )}
                        </div>
                        
                        <motion.button
                          type="submit"
                          disabled={isLoading}
                          whileHover={{ scale: isLoading ? 1 : 1.02 }}
                          whileTap={{ scale: isLoading ? 1 : 0.98 }}
                          className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-red-700 transition-all duration-300 font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Signing In...</span>
                            </div>
                          ) : (
                            'Sign In'
                          )}
                        </motion.button>
                      </form>
                      {systemStatus?.first_user_registration && (
                        <p className="text-center mt-4 text-sm text-gray-600">
                          Need to register your institution?{' '}
                          <button
                            onClick={() => setShowRegister(true)}
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            Register here
                          </button>
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-red-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Enterprise-grade Security & Encryption</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="flex-1 bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden hidden lg:block">
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1581093458791-9d66defd7f7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                }}
              ></div>
              <div className="relative z-20 h-full flex items-center justify-center p-12">
                <div className="text-center text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="text-3xl font-bold mb-4">Secure Prison Management</h2>
                    <p className="text-lg text-blue-100 mb-6">
                      Advanced security system for Ghana's correctional facilities
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        <span>Real-time Monitoring</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span>Prisoner Management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserPlus className="w-4 h-4 text-green-400" />
                        <span>Visitor Control</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-green-400" />
                        <span>Analytics & Reports</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Sidebar Component - MOBILE OPTIMIZED
  const Sidebar = () => (
    <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out mobile-sidebar' : 'relative'} ${
      isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
    } w-64 min-h-screen flex flex-col bg-gradient-to-b from-[#3A2C1E] to-[#2A1F15] shadow-2xl border-r border-[#5D4C3A]`}>
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 mobile-sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <div className="h-full flex flex-col z-50 relative mobile-sidebar-content">
        <div className="p-4 sm:p-6 border-b border-[#5D4C3A] mobile-sidebar-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white">PrisonMS</h1>
                <p className="text-[#D4B996] text-xs">Ghana Prison Service</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-[#5D4C3A] transition-colors mobile-sidebar-close"
              >
                <X size={20} className="text-white" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 mobile-sidebar-nav">
          <button
            onClick={() => {setCurrentView('dashboard'); isMobile && setSidebarOpen(false);}}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm mobile-nav-item ${
              currentView === 'dashboard' 
                ? 'bg-[#5D4C3A] text-white font-medium border-r-4 border-yellow-400 shadow-sm' 
                : 'text-[#D4B996] hover:bg-[#5D4C3A] hover:text-white'
            }`}
          >
            <Home size={18} className={currentView === 'dashboard' ? 'text-yellow-400' : 'text-[#D4B996]'} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {setCurrentView('prisoners'); isMobile && setSidebarOpen(false);}}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm mobile-nav-item ${
              currentView === 'prisoners' 
                ? 'bg-[#5D4C3A] text-white font-medium border-r-4 border-yellow-400 shadow-sm' 
                : 'text-[#D4B996] hover:bg-[#5D4C3A] hover:text-white'
            }`}
          >
            <Users size={18} className={currentView === 'prisoners' ? 'text-yellow-400' : 'text-[#D4B996]'} />
            <span>Prisoners</span>
          </button>

          <button
            onClick={() => {setCurrentView('visitors'); isMobile && setSidebarOpen(false);}}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm mobile-nav-item ${
              currentView === 'visitors' 
                ? 'bg-[#5D4C3A] text-white font-medium border-r-4 border-yellow-400 shadow-sm' 
                : 'text-[#D4B996] hover:bg-[#5D4C3A] hover:text-white'
            }`}
          >
            <UserPlus size={18} className={currentView === 'visitors' ? 'text-yellow-400' : 'text-[#D4B996]'} />
            <span>Visitors</span>
          </button>

          <button
            onClick={() => {setCurrentView('cells'); isMobile && setSidebarOpen(false);}}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm mobile-nav-item ${
              currentView === 'cells' 
                ? 'bg-[#5D4C3A] text-white font-medium border-r-4 border-yellow-400 shadow-sm' 
                : 'text-[#D4B996] hover:bg-[#5D4C3A] hover:text-white'
            }`}
          >
            <Building2 size={18} className={currentView === 'cells' ? 'text-yellow-400' : 'text-[#D4B996]'} />
            <span>Cells</span>
          </button>

          {/* NEW OFFICERS DUTY SIDEBAR ITEM */}
          <button
            onClick={() => {setCurrentView('officers'); isMobile && setSidebarOpen(false);}}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm mobile-nav-item ${
              currentView === 'officers' 
                ? 'bg-[#5D4C3A] text-white font-medium border-r-4 border-yellow-400 shadow-sm' 
                : 'text-[#D4B996] hover:bg-[#5D4C3A] hover:text-white'
            }`}
          >
            <OfficersIcon size={18} className={currentView === 'officers' ? 'text-yellow-400' : 'text-[#D4B996]'} />
            <span>Officers Duty</span>
          </button>

          <button
            onClick={() => {setCurrentView('reports'); isMobile && setSidebarOpen(false);}}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm mobile-nav-item ${
              currentView === 'reports' 
                ? 'bg-[#5D4C3A] text-white font-medium border-r-4 border-yellow-400 shadow-sm' 
                : 'text-[#D4B996] hover:bg-[#5D4C3A] hover:text-white'
            }`}
          >
            <BarChart3 size={18} className={currentView === 'reports' ? 'text-yellow-400' : 'text-[#D4B996]'} />
            <span>Reports</span>
          </button>
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-[#5D4C3A] mobile-quick-actions">
          <h3 className="text-sm font-medium text-[#D4B996] mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => setShowPrisonerForm(true)}
              className="w-full text-left px-3 py-2 text-xs text-yellow-400 hover:bg-[#5D4C3A] rounded-lg transition-colors flex items-center space-x-2 mobile-quick-action"
            >
              <PlusCircle size={14} className="text-yellow-400" />
              <span>New Prisoner</span>
            </button>

            <button
              onClick={() => setShowVisitorForm(true)}
              className="w-full text-left px-3 py-2 text-xs text-green-400 hover:bg-[#5D4C3A] rounded-lg transition-colors flex items-center space-x-2 mobile-quick-action"
            >
              <UserPlus size={14} className="text-green-400" />
              <span>Add Visitor</span>
            </button>

            <button
              onClick={() => setShowCellForm(true)}
              className="w-full text-left px-3 py-2 text-xs text-purple-400 hover:bg-[#5D4C3A] rounded-lg transition-colors flex items-center space-x-2 mobile-quick-action"
            >
              <Building2 size={14} className="text-purple-400" />
              <span>Add Cell</span>
            </button>

            {/* NEW OFFICER DUTY QUICK ACTION */}
            <button
              onClick={() => setShowOfficerForm(true)}
              className="w-full text-left px-3 py-2 text-xs text-orange-400 hover:bg-[#5D4C3A] rounded-lg transition-colors flex items-center space-x-2 mobile-quick-action"
            >
              <Clipboard size={14} className="text-orange-400" />
              <span>Assign Duty</span>
            </button>

            <button
              onClick={() => setShowAIChat(true)}
              className="w-full text-left px-3 py-2 text-xs text-pink-400 hover:bg-[#5D4C3A] rounded-lg transition-colors flex items-center space-x-2 mobile-quick-action"
            >
              <MessageCircle size={14} className="text-pink-400" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
        
        {/* User Profile Section */}
        <div className="p-4 border-t border-[#5D4C3A] mobile-user-profile">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-medium text-xs">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-[#D4B996] truncate">
                {user?.institution_name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#D4B996] hover:text-white p-1 rounded-lg transition-colors mobile-logout-btn"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  // Dashboard Analytics Cards with Framer Motion - MOBILE OPTIMIZED
  const AnalyticsCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 mobile-analytics-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mobile-analytics-title">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2 mobile-analytics-value">{value}</p>
          {change && (
            <p className={`text-xs mt-1 flex items-center mobile-analytics-change ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp size={12} className={`mr-1 ${change > 0 ? '' : 'rotate-180'}`} />
              {Math.abs(change)}% from last week
            </p>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-full flex items-center justify-center mobile-analytics-icon`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Main Dashboard Component - MOBILE OPTIMIZED
  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6 mobile-dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mobile-dashboard-header">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mobile-dashboard-title">Dashboard Overview</h2>
        <div className="text-xs sm:text-sm text-gray-500 mobile-dashboard-time">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Analytics Cards with Framer Motion - MOBILE GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mobile-analytics-grid">
        <AnalyticsCard
          title="Total Prisoners"
          value={dashboardSummary?.total_prisoners || 0}
          icon={Users}
          color="bg-blue-500"
          change={12}
        />
        <AnalyticsCard
          title="Visitors Today"
          value={dashboardSummary?.visitors_today || 0}
          icon={UserPlus}
          color="bg-green-500"
          change={8}
        />
        <AnalyticsCard
          title="Total Cells"
          value={dashboardSummary?.total_cells || 0}
          icon={Building2}
          color="bg-purple-500"
          change={0}
        />
        <AnalyticsCard
          title="Officers on Duty"
          value={officerDuties.length || 0}
          icon={Shield}
          color="bg-red-500"
          change={5}
        />
      </div>

      {/* Recent Prisoners Table - MOBILE OPTIMIZED */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mobile-table-container">
        <div className="p-3 sm:p-4 border-b border-gray-200 mobile-table-header">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mobile-table-title">Recent Prisoners</h3>
            <button
              onClick={() => setShowPrisonerForm(true)}
              className="bg-[#3A2C1E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#2A1F15] transition-colors flex items-center space-x-2 text-xs sm:text-sm mobile-action-button"
            >
              <PlusCircle size={14} />
              <span>New Prisoner</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto mobile-table-scroll">
          <table className="w-full mobile-table">
            <thead className="bg-gray-50 mobile-table-head">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider mobile-table-header">ID</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider mobile-table-header">Name</th>
                {!isMobile && (
                  <>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider mobile-table-header">Crime</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider mobile-table-header">Status</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider mobile-table-header">Cell</th>
                  </>
                )}
                <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider mobile-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 mobile-table-body">
              {getFilteredPrisoners().slice(0, isMobile ? 5 : 10).map((prisoner, index) => (
                <tr key={generateUniqueKey(prisoner, 'prisoner', index)} className="hover:bg-gray-50 mobile-table-row">
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap mobile-table-cell">
                    <div className="text-xs font-medium text-gray-900 mobile-table-data">
                      {prisoner.prisoner_id}
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap mobile-table-cell">
                    <div>
                      <div className="text-sm font-medium text-gray-900 mobile-table-data">
                        {prisoner.first_name} {prisoner.last_name}
                      </div>
                      {isMobile && (
                        <div className="text-xs text-gray-500 mobile-table-data">{prisoner.crime}</div>
                      )}
                    </div>
                  </td>
                  {!isMobile && (
                    <>
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap mobile-table-cell">
                        <div className="text-sm text-gray-900 mobile-table-data">{prisoner.crime}</div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap mobile-table-cell">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full mobile-status-badge ${
                          prisoner.status === 'convicted' ? 'bg-red-100 text-red-800' :
                          prisoner.status === 'remand' ? 'bg-yellow-100 text-yellow-800' :
                          prisoner.status === 'released' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {prisoner.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap mobile-table-cell">
                        <span className="text-sm text-gray-900 mobile-table-data">{prisoner.cell_id}</span>
                      </td>
                    </>
                  )}
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-sm font-medium mobile-table-cell">
                    <div className="flex items-center space-x-1 sm:space-x-2 mobile-action-buttons">
                      <button
                        onClick={() => {
                          setSelectedPrisoner(prisoner);
                          setShowPrisonerEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded mobile-action-button"
                        title="Edit"
                      >
                        <Edit size={isMobile ? 12 : 14} />
                      </button>
                      <button
                        onClick={() => handleDeletePrisoner(prisoner.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded mobile-action-button"
                        title="Delete"
                      >
                        <Trash2 size={isMobile ? 12 : 14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {getFilteredPrisoners().length === 0 && (
          <div className="p-6 sm:p-8 text-center mobile-empty-state">
            <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 mobile-empty-title">No prisoners found</h3>
            <p className="text-gray-500 mb-4 mobile-empty-description">Get started by registering your first prisoner.</p>
            <button
              onClick={() => setShowPrisonerForm(true)}
              className="bg-[#3A2C1E] text-white px-4 py-2 rounded-lg hover:bg-[#2A1F15] transition-colors text-sm mobile-empty-action"
            >
              Register Prisoner
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Prisoners Management View - MOBILE OPTIMIZED
  const renderPrisonersView = () => (
    <div className="space-y-4 sm:space-y-6 mobile-prisoners-view">
      {/* Header and Filters - MOBILE OPTIMIZED */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-200 mobile-filters-container">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto mobile-search-container">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <MobileOptimizedInput
                type="text"
                placeholder="Search prisoners..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full mobile-search-input"
              />
            </div>
            <div className="flex space-x-2 w-full sm:w-auto mobile-filter-buttons">
              <MobileOptimizedSelect
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm mobile-filter-select"
              >
                <option value="all">All Status</option>
                <option value="remand">Remand</option>
                <option value="convicted">Convicted</option>
                <option value="released">Released</option>
                <option value="transferred">Transferred</option>
              </MobileOptimizedSelect>
              <MobileOptimizedSelect
                value={genderFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGenderFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm mobile-filter-select"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </MobileOptimizedSelect>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto mobile-action-buttons">
            <button
              onClick={() => generatePrisonersReport('excel')}
              className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-xs sm:text-sm mobile-report-button"
            >
              <DownloadCloud size={14} />
              <span className={isMobile ? 'hidden sm:inline' : ''}>Excel</span>
            </button>
            <button
              onClick={() => generatePrisonersReport('pdf')}
              className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-xs sm:text-sm mobile-report-button"
            >
              <FileText size={14} />
              <span className={isMobile ? 'hidden sm:inline' : ''}>PDF</span>
            </button>
            <button
              onClick={() => setShowPrisonerForm(true)}
              className="bg-[#3A2C1E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#2A1F15] transition-colors flex items-center space-x-2 text-xs sm:text-sm mobile-add-button"
            >
              <PlusCircle size={14} />
              <span>New Prisoner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prisoners Grid - MOBILE OPTIMIZED */}
      <div className={`grid gap-4 mobile-prisoners-grid ${
        isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {getFilteredPrisoners().map((prisoner, index) => (
          <motion.div
            key={generateUniqueKey(prisoner, 'prisoner-card', index)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 mobile-prisoner-card"
          >
            <div className="p-3 sm:p-4 mobile-prisoner-card-content">
              <div className="flex items-start justify-between mb-3 mobile-prisoner-header">
                <div className="flex-1 min-w-0 mobile-prisoner-info">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mobile-prisoner-name">
                    {prisoner.first_name} {prisoner.last_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mobile-prisoner-id">ID: {prisoner.prisoner_id}</p>
                  <div className="flex items-center space-x-2 mt-1 mobile-prisoner-tags">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full mobile-status-tag ${
                      prisoner.status === 'convicted' ? 'bg-red-100 text-red-800' :
                      prisoner.status === 'remand' ? 'bg-yellow-100 text-yellow-800' :
                      prisoner.status === 'released' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {prisoner.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full mobile-gender-tag ${
                      prisoner.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                    }`}>
                      {prisoner.gender}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mobile-prisoner-actions">
                  <button
                    onClick={() => {
                      setSelectedPrisoner(prisoner);
                      setShowPrisonerEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded mobile-edit-button"
                    title="Edit Prisoner"
                  >
                    <Edit size={isMobile ? 12 : 14} />
                  </button>
                  <button
                    onClick={() => handleDeletePrisoner(prisoner.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded mobile-delete-button"
                    title="Delete Prisoner"
                  >
                    <Trash2 size={isMobile ? 12 : 14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm mobile-prisoner-details">
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Crime:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{prisoner.crime}</span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Sentence:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{prisoner.sentence_duration}</span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Cell:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{prisoner.cell_id}</span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Admitted:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">
                    {new Date(prisoner.date_admitted).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {prisoner.medical_conditions && prisoner.medical_conditions.length > 0 && (
                <div className="mt-3 p-2 bg-yellow-50 rounded-lg mobile-medical-conditions">
                  <p className="text-xs font-medium text-yellow-800">Medical Conditions:</p>
                  <p className="text-xs text-yellow-700">{prisoner.medical_conditions.join(', ')}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {getFilteredPrisoners().length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200 mobile-empty-state">
          <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 mobile-empty-title">No prisoners found</h3>
          <p className="text-gray-500 mb-4 mobile-empty-description">Try adjusting your search filters or register a new prisoner.</p>
          <button
            onClick={() => setShowPrisonerForm(true)}
            className="bg-[#3A2C1E] text-white px-4 py-2 rounded-lg hover:bg-[#2A1F15] transition-colors text-sm mobile-empty-action"
          >
            Register Prisoner
          </button>
        </div>
      )}
    </div>
  );

  // Visitors Management View - MOBILE OPTIMIZED
  const renderVisitorsView = () => (
    <div className="space-y-4 sm:space-y-6 mobile-visitors-view">
      {/* Header and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-200 mobile-filters-container">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto mobile-search-container">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <MobileOptimizedInput
                type="text"
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full mobile-search-input"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto mobile-action-buttons">
            <button
              onClick={() => generateVisitorsReport('excel')}
              className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-xs sm:text-sm mobile-report-button"
            >
              <DownloadCloud size={14} />
              <span className={isMobile ? 'hidden sm:inline' : ''}>Excel Report</span>
            </button>
            <button
              onClick={() => setShowVisitorForm(true)}
              className="bg-[#3A2C1E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#2A1F15] transition-colors flex items-center space-x-2 text-xs sm:text-sm mobile-add-button"
            >
              <UserPlus size={14} />
              <span>Add Visitor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visitors Grid - MOBILE OPTIMIZED */}
      <div className={`grid gap-4 mobile-visitors-grid ${
        isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {getFilteredVisitors().map((visitor, index) => (
          <motion.div
            key={generateUniqueKey(visitor, 'visitor', index)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 mobile-visitor-card"
          >
            <div className="p-3 sm:p-4 mobile-visitor-card-content">
              <div className="flex items-start justify-between mb-3 mobile-visitor-header">
                <div className="flex-1 min-w-0 mobile-visitor-info">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mobile-visitor-name">
                    {visitor.first_name} {visitor.last_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mobile-visitor-relationship">Relationship: {visitor.relationship}</p>
                  <div className="flex items-center space-x-2 mt-1 mobile-visitor-tags">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full mobile-approval-tag ${
                      visitor.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {visitor.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mobile-visitor-actions">
                  {!visitor.approved && (
                    <button
                      onClick={() => handleApproveVisitor(visitor.id)}
                      className="text-green-600 hover:text-green-800 p-1 rounded mobile-approve-button"
                      title="Approve Visitor"
                    >
                      <CheckCircle size={isMobile ? 12 : 14} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedVisitor(visitor);
                      setShowVisitorEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded mobile-edit-button"
                    title="Edit Visitor"
                  >
                    <Edit size={isMobile ? 12 : 14} />
                  </button>
                  <button
                    onClick={() => handleDeleteVisitor(visitor.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded mobile-delete-button"
                    title="Delete Visitor"
                  >
                    <Trash2 size={isMobile ? 12 : 14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm mobile-visitor-details">
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Prisoner:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{visitor.prisoner_name}</span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Visit Date:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">
                    {new Date(visitor.visit_date).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Phone:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{visitor.phone}</span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">ID Number:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{visitor.id_number}</span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Purpose:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{visitor.purpose}</span>
                </div>
                {visitor.items_brought && visitor.items_brought.length > 0 && (
                  <div className="flex justify-between mobile-detail-row">
                    <span className="text-gray-500 mobile-detail-label">Items:</span>
                    <span className="font-medium text-gray-900 mobile-detail-value">{visitor.items_brought.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {getFilteredVisitors().length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200 mobile-empty-state">
          <UserPlus className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 mobile-empty-title">No visitors found</h3>
          <p className="text-gray-500 mb-4 mobile-empty-description">Try adjusting your search filters or register a new visitor.</p>
          <button
            onClick={() => setShowVisitorForm(true)}
            className="bg-[#3A2C1E] text-white px-4 py-2 rounded-lg hover:bg-[#2A1F15] transition-colors text-sm mobile-empty-action"
          >
            Register Visitor
          </button>
        </div>
      )}
    </div>
  );

  // Cells Management View - MOBILE OPTIMIZED
  const renderCellsView = () => (
    <div className="space-y-4 sm:space-y-6 mobile-cells-view">
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-200 mobile-header-container">
        <div className="flex items-center justify-between mobile-header-content">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mobile-header-title">Prison Cells</h3>
          <button
            onClick={() => setShowCellForm(true)}
            className="bg-[#3A2C1E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#2A1F15] transition-colors flex items-center space-x-2 text-xs sm:text-sm mobile-add-button"
          >
            <PlusCircle size={14} />
            <span>Add Cell</span>
          </button>
        </div>
      </div>

      {/* Cells Grid - MOBILE OPTIMIZED */}
      <div className={`grid gap-4 mobile-cells-grid ${
        isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {cells.map((cell, index) => (
          <motion.div
            key={generateUniqueKey(cell, 'cell', index)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 mobile-cell-card"
          >
            <div className="p-3 sm:p-4 mobile-cell-card-content">
              <div className="flex items-center justify-between mb-3 mobile-cell-header">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mobile-cell-title">Cell {cell.cell_number}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full mobile-cell-status ${
                  cell.status === 'available' ? 'bg-green-100 text-green-800' :
                  cell.status === 'full' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {cell.status}
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm mobile-cell-details">
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Block:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{cell.block}</span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Capacity:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{cell.capacity}</span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Occupancy:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">
                    {cell.current_occupancy} / {cell.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mobile-occupancy-bar">
                  <div 
                    className={`h-2 rounded-full mobile-occupancy-fill ${
                      cell.occupancy_percentage && cell.occupancy_percentage > 80 ? 'bg-red-500' :
                      cell.occupancy_percentage && cell.occupancy_percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${cell.occupancy_percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4 mobile-cell-actions">
                <button
                  onClick={() => handleDeleteCell(cell.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded text-xs sm:text-sm flex items-center space-x-1 mobile-delete-button"
                  title="Delete Cell"
                >
                  <Trash2 size={isMobile ? 12 : 14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {cells.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200 mobile-empty-state">
          <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 mobile-empty-title">No cells found</h3>
          <p className="text-gray-500 mb-4 mobile-empty-description">Get started by creating your first prison cell.</p>
          <button
            onClick={() => setShowCellForm(true)}
            className="bg-[#3A2C1E] text-white px-4 py-2 rounded-lg hover:bg-[#2A1F15] transition-colors text-sm mobile-empty-action"
          >
            Create Cell
          </button>
        </div>
      )}
    </div>
  );

  // NEW: Officers Duty Management View - MOBILE OPTIMIZED
  const renderOfficersView = () => (
    <div className="space-y-4 sm:space-y-6 mobile-officers-view">
      {/* Header and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-200 mobile-filters-container">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto mobile-search-container">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <MobileOptimizedInput
                type="text"
                placeholder="Search officers or blocks..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm w-full mobile-search-input"
              />
            </div>
            <MobileOptimizedSelect
              value={shiftFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShiftFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm mobile-filter-select"
            >
              <option value="all">All Shifts</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="night">Night</option>
            </MobileOptimizedSelect>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto mobile-action-buttons">
            <button
              onClick={() => loadOfficerDuties()}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-xs sm:text-sm mobile-refresh-button"
            >
              <RefreshCw size={14} />
              <span className={isMobile ? 'hidden sm:inline' : ''}>Refresh</span>
            </button>
            <button
              onClick={() => setShowOfficerForm(true)}
              className="bg-[#3A2C1E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#2A1F15] transition-colors flex items-center space-x-2 text-xs sm:text-sm mobile-add-button"
            >
              <Clipboard size={14} />
              <span>Assign Duty</span>
            </button>
          </div>
        </div>
      </div>

      {/* Officer Duties Grid - MOBILE OPTIMIZED */}
      <div className={`grid gap-4 mobile-officers-grid ${
        isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {getFilteredOfficerDuties().map((duty, index) => (
          <motion.div
            key={generateUniqueKey(duty, 'officer-duty', index)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 mobile-officer-card"
          >
            <div className="p-3 sm:p-4 mobile-officer-card-content">
              <div className="flex items-start justify-between mb-3 mobile-officer-header">
                <div className="flex-1 min-w-0 mobile-officer-info">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mobile-officer-name">
                    {duty.officer_name || 'Unknown Officer'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mobile-officer-block">Block: {duty.block_assigned}</p>
                  <div className="flex items-center space-x-2 mt-1 mobile-officer-tags">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full mobile-shift-tag ${
                      duty.shift === 'morning' ? 'bg-blue-100 text-blue-800' :
                      duty.shift === 'afternoon' ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {duty.shift}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mobile-date-tag">
                      {new Date(duty.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mobile-officer-actions">
                  <button
                    onClick={() => {
                      setSelectedOfficerDuty(duty);
                      setShowOfficerEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded mobile-edit-button"
                    title="Edit Duty"
                  >
                    <Edit size={isMobile ? 12 : 14} />
                  </button>
                  <button
                    onClick={() => handleDeleteOfficerDuty(duty.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded mobile-delete-button"
                    title="Delete Duty"
                  >
                    <Trash2 size={isMobile ? 12 : 14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm mobile-officer-details">
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Officer:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{duty.officer_name}</span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Date:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">
                    {new Date(duty.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Shift:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value capitalize">{duty.shift}</span>
                </div>
                <div className="flex justify-between mobile-detail-row">
                  <span className="text-gray-500 mobile-detail-label">Block:</span>
                  <span className="font-medium text-gray-900 mobile-detail-value">{duty.block_assigned}</span>
                </div>
                {duty.officer_phone && (
                  <div className="flex justify-between mobile-detail-row">
                    <span className="text-gray-500 mobile-detail-label">Phone:</span>
                    <span className="font-medium text-gray-900 mobile-detail-value">{duty.officer_phone}</span>
                  </div>
                )}
                {duty.notes && (
                  <div className="mt-2 p-2 bg-orange-50 rounded-lg mobile-officer-notes">
                    <p className="text-xs font-medium text-orange-800">Notes:</p>
                    <p className="text-xs text-orange-700">{duty.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {getFilteredOfficerDuties().length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200 mobile-empty-state">
          <OfficersIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 mobile-empty-title">No duty assignments found</h3>
          <p className="text-gray-500 mb-4 mobile-empty-description">Try adjusting your search filters or assign a new duty.</p>
          <button
            onClick={() => setShowOfficerForm(true)}
            className="bg-[#3A2C1E] text-white px-4 py-2 rounded-lg hover:bg-[#2A1F15] transition-colors text-sm mobile-empty-action"
          >
            Assign Duty
          </button>
        </div>
      )}

      {/* Available Officers Summary - MOBILE OPTIMIZED */}
      {availableOfficers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 mobile-officers-summary">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 mobile-summary-title">Available Officers</h3>
          <div className={`grid gap-3 sm:gap-4 mobile-officers-grid ${
            isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {availableOfficers.slice(0, isMobile ? 2 : 4).map((officer, index) => (
              <div key={generateUniqueKey(officer, 'available-officer', index)} className="bg-gray-50 rounded-lg p-3 sm:p-4 mobile-available-officer">
                <div className="flex items-center space-x-3 mobile-officer-item">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center mobile-officer-avatar">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0 mobile-officer-details">
                    <p className="text-sm font-medium text-gray-900 mobile-officer-name">
                      {officer.first_name} {officer.last_name}
                    </p>
                    <p className="text-xs text-gray-500 mobile-officer-role">{officer.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {availableOfficers.length > (isMobile ? 2 : 4) && (
            <p className="text-xs sm:text-sm text-gray-500 mt-3 mobile-officers-count">
              +{availableOfficers.length - (isMobile ? 2 : 4)} more officers available
            </p>
          )}
        </div>
      )}
    </div>
  );

  // Reports View - MOBILE OPTIMIZED
  const renderReportsView = () => (
    <div className="space-y-4 sm:space-y-6 mobile-reports-view">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mobile-reports-title">Reports & Analytics</h2>

      {/* Report Generation Cards - MOBILE OPTIMIZED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mobile-reports-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 mobile-report-card"
        >
          <div className="flex items-center space-x-3 sm:space-x-4 mobile-report-header">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mobile-report-icon">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="flex-1 mobile-report-info">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mobile-report-title">Prisoners Report</h3>
              <p className="text-gray-600 text-xs sm:text-sm mobile-report-description">Generate comprehensive prisoners report</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 mobile-report-actions">
            <button
              onClick={() => generatePrisonersReport('excel')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm mobile-report-button"
            >
              <DownloadCloud size={14} />
              <span>Excel</span>
            </button>
            <button
              onClick={() => generatePrisonersReport('pdf')}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm mobile-report-button"
            >
              <FileText size={14} />
              <span>PDF</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 mobile-report-card"
        >
          <div className="flex items-center space-x-3 sm:space-x-4 mobile-report-header">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mobile-report-icon">
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="flex-1 mobile-report-info">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mobile-report-title">Visitors Report</h3>
              <p className="text-gray-600 text-xs sm:text-sm mobile-report-description">Generate comprehensive visitors report</p>
            </div>
          </div>
          <div className="mt-4 mobile-report-actions">
            <button
              onClick={() => generateVisitorsReport('excel')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm mobile-report-button"
            >
              <DownloadCloud size={14} />
              <span>Generate Excel Report</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Statistics - MOBILE OPTIMIZED */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mobile-stats-grid">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 mobile-stat-card">
          <div className="text-center mobile-stat-content">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 mobile-stat-icon">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mobile-stat-value">{dashboardSummary?.total_prisoners || 0}</h3>
            <p className="text-gray-600 mobile-stat-label">Total Prisoners</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 mobile-stat-card">
          <div className="text-center mobile-stat-content">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 mobile-stat-icon">
              <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mobile-stat-value">{dashboardSummary?.visitors_this_week || 0}</h3>
            <p className="text-gray-600 mobile-stat-label">Visitors This Week</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 mobile-stat-card">
          <div className="text-center mobile-stat-content">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 mobile-stat-icon">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mobile-stat-value">{dashboardSummary?.total_cells || 0}</h3>
            <p className="text-gray-600 mobile-stat-label">Total Cells</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Layout - MOBILE OPTIMIZED
  return (
    <div className="min-h-screen bg-gray-50 mobile-app-container">
      <ToastContainer 
        position={isMobile ? "top-center" : "top-right"} 
        autoClose={5000}
        className="mobile-toast-container"
      />
      <NotificationSystem />
      
      {/* Header - MOBILE OPTIMIZED */}
      <header className="bg-gradient-to-r from-[#3A2C1E] to-[#2A1F15] shadow-lg border-b border-[#5D4C3A] relative z-10 mobile-header">
        <div className="px-3 sm:px-4 lg:px-8 mobile-header-container">
          <div className="flex items-center justify-between h-14 sm:h-16 mobile-header-content">
            {/* Left side */}
            <div className="flex items-center space-x-2 sm:space-x-4 mobile-header-left">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-[#5D4C3A] lg:hidden mobile-menu-button"
                >
                  <Menu size={20} className="text-white" />
                </button>
              )}
              <div className="flex items-center space-x-2 sm:space-x-3 mobile-header-brand">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-red-600 rounded-lg flex items-center justify-center mobile-header-logo">
                  <Shield className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white mobile-header-title">Prison Management System</h1>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2 sm:space-x-4 mobile-header-right">
              {!isMobile && (
                <div className="hidden sm:block text-sm text-[#D4B996] mobile-user-welcome">
                  Welcome, <span className="font-medium text-white">{user?.first_name} {user?.last_name}</span>
                </div>
              )}
              <div className="text-xs px-2 py-1 bg-yellow-400 text-[#3A2C1E] rounded-full font-medium mobile-user-role">
                {user?.role?.toUpperCase()}
              </div>
              <button
                onClick={() => setShowAIChat(true)}
                className="text-[#D4B996] hover:text-white p-2 rounded-lg hover:bg-[#5D4C3A] transition-colors mobile-ai-button"
                title="AI Assistant"
              >
                <MessageCircle size={18} />
              </button>
              <button
                onClick={handleLogout}
                className="text-[#D4B996] hover:text-white p-2 rounded-lg hover:bg-[#5D4C3A] transition-colors mobile-logout-button"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex mobile-app-content">
        {/* Sidebar */}
        {!isMobile && <Sidebar />}
        {isMobile && sidebarOpen && <Sidebar />}

        {/* Main Content - MOBILE OPTIMIZED */}
        <main className={`flex-1 overflow-x-hidden mobile-main-content ${
          isMobile ? 'p-2' : 'p-4 lg:p-6'
        }`}>
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'prisoners' && renderPrisonersView()}
          {currentView === 'visitors' && renderVisitorsView()}
          {currentView === 'cells' && renderCellsView()}
          {currentView === 'officers' && renderOfficersView()}
          {currentView === 'reports' && renderReportsView()}
        </main>
      </div>

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-40 mobile-fab-container">
          <div className="flex flex-col space-y-2 mobile-fab-buttons">
            <button
              onClick={() => setShowAIChat(true)}
              className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors mobile-fab-button"
              title="AI Assistant"
            >
              <MessageCircle size={20} />
            </button>
            <button
              onClick={() => {
                if (currentView === 'prisoners') setShowPrisonerForm(true);
                else if (currentView === 'visitors') setShowVisitorForm(true);
                else if (currentView === 'cells') setShowCellForm(true);
                else if (currentView === 'officers') setShowOfficerForm(true);
                else setShowPrisonerForm(true);
              }}
              className="bg-[#3A2C1E] text-white p-3 rounded-full shadow-lg hover:bg-[#2A1F15] transition-colors mobile-fab-button"
              title="Quick Add"
            >
              <PlusCircle size={20} />
            </button>
          </div>
        </div>
      )}

      {/* AI Chat Bot */}
      <AIChatBot
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        token={token}
      />

      {/* Modals */}
      <PrisonerRegistrationModal
        isOpen={showPrisonerForm}
        onClose={() => setShowPrisonerForm(false)}
        onSubmit={handleCreatePrisoner}
        isLoading={isLoading}
      />

      <VisitorRegistrationModal
        isOpen={showVisitorForm}
        onClose={() => setShowVisitorForm(false)}
        onSubmit={handleCreateVisitor}
        isLoading={isLoading}
        prisoners={prisoners}
      />

      <CellRegistrationModal
        isOpen={showCellForm}
        onClose={() => setShowCellForm(false)}
        onSubmit={handleCreateCell}
        isLoading={isLoading}
      />

      {/* NEW: Officer Duty Modals */}
      <OfficerRegistrationModal
        isOpen={showOfficerForm}
        onClose={() => setShowOfficerForm(false)}
        onSubmit={handleCreateOfficerDuty}
        isLoading={isLoading}
        availableOfficers={availableOfficers}
      />

      <OfficerEditModal
        isOpen={showOfficerEditModal}
        onClose={() => {
          setShowOfficerEditModal(false);
          setSelectedOfficerDuty(null);
        }}
        onSubmit={(dutyId, data) => handleUpdateOfficerDuty(dutyId, data)}
        isLoading={isLoading}
        duty={selectedOfficerDuty}
      />

      <PrisonerEditModal
        isOpen={showPrisonerEditModal}
        onClose={() => {
          setShowPrisonerEditModal(false);
          setSelectedPrisoner(null);
        }}
        onSubmit={(prisonerId, data) => handleUpdatePrisoner(prisonerId, data)}
        isLoading={isLoading}
        prisoner={selectedPrisoner}
      />

      <VisitorEditModal
        isOpen={showVisitorEditModal}
        onClose={() => {
          setShowVisitorEditModal(false);
          setSelectedVisitor(null);
        }}
        onSubmit={(data) => selectedVisitor && handleUpdateVisitor(selectedVisitor.id, data)}
        isLoading={isLoading}
        visitor={selectedVisitor}
      />

      {/* Mobile-specific styles */}
      <style jsx global>{`
        /* Mobile-specific CSS fixes */
        @media (max-width: 768px) {
          .mobile-optimized-input,
          .mobile-optimized-textarea,
          .mobile-optimized-select {
            font-size: 16px !important; /* Prevents iOS zoom */
            min-height: 44px !important; /* Better touch targets */
            padding: 12px 16px !important;
            border-radius: 8px !important;
          }

          .mobile-optimized-input:focus,
          .mobile-optimized-textarea:focus,
          .mobile-optimized-select:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
          }

          /* Prevent horizontal scrolling */
          .mobile-app-container {
            overflow-x: hidden;
          }

          /* Better touch targets for buttons */
          .mobile-action-button,
          .mobile-nav-item,
          .mobile-fab-button {
            min-height: 44px;
            min-width: 44px;
          }

          /* Improved scrolling */
          .mobile-form-scroll {
            -webkit-overflow-scrolling: touch;
          }

          /* Better modal experience */
          .mobile-sidebar-overlay {
            backdrop-filter: blur(4px);
          }

          /* Fix for iOS input styling */
          input[type="text"],
          input[type="email"],
          input[type="password"],
          input[type="tel"],
          input[type="number"],
          textarea,
          select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border-radius: 8px;
          }

          /* Fix for select arrows on iOS */
          select {
            background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 8px 10px;
            padding-right: 40px !important;
          }
        }

        /* Enhanced focus states for accessibility */
        .mobile-optimized-input:focus-visible,
        .mobile-optimized-textarea:focus-visible,
        .mobile-optimized-select:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Smooth transitions for all interactive elements */
        .mobile-action-button,
        .mobile-nav-item,
        .mobile-optimized-input,
        .mobile-optimized-textarea,
        .mobile-optimized-select {
          transition: all 0.2s ease-in-out;
        }

        /* Improved hover states for desktop */
        @media (hover: hover) {
          .mobile-action-button:hover,
          .mobile-nav-item:hover {
            transform: translateY(-1px);
          }
        }

        /* Active states for mobile touch */
        .mobile-action-button:active,
          .mobile-nav-item:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default PrisonManagementApp;