// Steigel Innovations Hub Central State Store
const STORE_KEY = 'steigel_system_data';
const SESSION_KEY = 'steigel_active_session';
const STORE_VERSION_KEY = 'steigel_store_version';
const CURRENT_VERSION = 'v2_clean_no_dummy';

// Helper: safe JSON parsing
const safeParse = (str, fallback) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Initial Seed Data (Clean state with accounts only)
const defaultSystemData = {
  users: [
    { id: 'admin-1', name: 'System Administrator', email: 'admin@gmail.com', password: '123456', role: 'admin', level: 3, status: 'active', department: 'Executive', joined: new Date().toISOString().split('T')[0], phone: '+91 90000 00001' },
    { id: 'mentor-1', name: 'Faculty Tech Mentor', email: 'mentor@gmail.com', password: '123456', role: 'mentor', level: 2, status: 'active', department: 'AI & Robotics', joined: new Date().toISOString().split('T')[0], phone: '+91 94494 46793' },
    { id: 'intern-1', name: 'Software Engineering Associate', email: 'student@gmail.com', password: '123456', role: 'intern', level: 1, status: 'active', department: 'Software Engineering', batch: 'Batch A - 2026', joined: new Date().toISOString().split('T')[0], phone: '+91 99999 88888', ndaAccepted: true },
    { id: 'intern-2', name: 'Data Science Associate', email: 'intern2@gmail.com', password: '123456', role: 'intern', level: 1, status: 'active', department: 'Data Science', batch: 'Batch A - 2026', joined: new Date().toISOString().split('T')[0], phone: '+91 88888 77777', ndaAccepted: true },
    { id: 'intern-3', name: 'Cloud Operations Associate', email: 'intern3@gmail.com', password: '123456', role: 'intern', level: 1, status: 'active', department: 'Cloud Operations', batch: 'Batch B - 2026', joined: new Date().toISOString().split('T')[0], phone: '+91 77777 66666', ndaAccepted: true }
  ],
  mentors: [
    { id: 'mentor-1', name: 'Faculty Tech Mentor', email: 'mentor@gmail.com', department: 'AI & Robotics', assignedInterns: [], activeProjects: [], performance: '0%', status: 'active' }
  ],
  interns: [
    { id: 'intern-1', name: 'Software Engineering Associate', email: 'student@gmail.com', department: 'Software Engineering', batch: 'Batch A - 2026', status: 'active', mentorId: null, projectId: null, attendanceScore: 0, taskProgress: 0, trainingProgress: 0, statusNotes: '', certificateStatus: 'none' },
    { id: 'intern-2', name: 'Data Science Associate', email: 'intern2@gmail.com', department: 'Data Science', batch: 'Batch A - 2026', status: 'active', mentorId: null, projectId: null, attendanceScore: 0, taskProgress: 0, trainingProgress: 0, statusNotes: '', certificateStatus: 'none' },
    { id: 'intern-3', name: 'Cloud Operations Associate', email: 'intern3@gmail.com', department: 'Cloud Operations', batch: 'Batch B - 2026', status: 'active', mentorId: null, projectId: null, attendanceScore: 0, taskProgress: 0, trainingProgress: 0, statusNotes: '', certificateStatus: 'none' }
  ],
  projects: [],
  tasks: [],
  submissions: [],
  attendance: [],
  feedback: [],
  messages: [],
  meetings: [],
  evaluations: [],
  certificates: [],
  vault: [],
  auditLogs: [],
  notifications: [],
  settings: {
    maintenanceMode: false,
    liveClassroom: null
  }
};

// Subscriptions callback list
let subscribers = [];

// Initialize Store
export const seedSystemData = (force = false) => {
  const existingVersion = localStorage.getItem(STORE_VERSION_KEY);
  if (force || !localStorage.getItem(STORE_KEY) || existingVersion !== CURRENT_VERSION) {
    localStorage.setItem(STORE_KEY, JSON.stringify(defaultSystemData));
    localStorage.setItem(STORE_VERSION_KEY, CURRENT_VERSION);
  }
};

// Call once at boot
seedSystemData();

// Get the current database
export const getSystemData = () => {
  const data = localStorage.getItem(STORE_KEY);
  if (!data) {
    seedSystemData();
    return defaultSystemData;
  }
  return safeParse(data, defaultSystemData);
};

// Write full database and trigger updates
export const updateSystemData = (newData) => {
  localStorage.setItem(STORE_KEY, JSON.stringify(newData));
  
  // Trigger internal CustomEvent for this tab
  const event = new CustomEvent('systemStoreUpdate');
  window.dispatchEvent(event);
  
  // Storage event triggers automatically in OTHER tabs
  notifyAllSubscribers();
};

// Subscribe to store updates
export const subscribeToSystemStore = (callback) => {
  subscribers.push(callback);
  
  // Add listeners
  const handleEvent = () => callback(getSystemData());
  window.addEventListener('systemStoreUpdate', handleEvent);
  window.addEventListener('storage', handleEvent);
  
  // Return cleanup function
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
    window.removeEventListener('systemStoreUpdate', handleEvent);
    window.removeEventListener('storage', handleEvent);
  };
};

const notifyAllSubscribers = () => {
  const data = getSystemData();
  subscribers.forEach(callback => callback(data));
};

// Session functions
export const getSession = () => {
  return safeParse(localStorage.getItem(SESSION_KEY), null);
};

export const setSession = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  // Log login action
  logAudit('LOGIN', user.name, user.id, 'User Session', { email: user.email });
  
  // Dispatch update event
  window.dispatchEvent(new CustomEvent('systemStoreUpdate'));
};

export const clearSession = () => {
  const user = getSession();
  if (user) {
    logAudit('LOGOUT', user.name, user.id, 'User Session', { email: user.email });
  }
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('systemStoreUpdate'));
};

// Authenticate a user
export const authenticateUser = (email, password) => {
  const data = getSystemData();
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (user) {
    if (user.status !== 'active') {
      throw new Error('Account deactivated. Contact system admin.');
    }
    user.ndaAccepted = true;
    updateSystemData(data);
    return user;
  }
  throw new Error('Invalid email credentials or password.');
};

// Immutable Audit Logging Helper
export const logAudit = (action, actor, actorId, target, metadata = {}) => {
  const data = getSystemData();
  
  // Create randomized IP
  const ips = ['192.168.1.45', '10.0.0.12', '172.16.254.1', '203.0.113.195'];
  const simulatedIp = ips[Math.floor(Math.random() * ips.length)];
  
  const newLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    actor,
    actorId,
    timestamp: new Date().toISOString(),
    target,
    metadata,
    simulatedIp
  };
  
  data.auditLogs.unshift(newLog); // Add to beginning
  updateSystemData(data);
};

// Helper to push standard notifications
export const pushNotification = (userId, text) => {
  const data = getSystemData();
  const newNotif = {
    id: `notif-${Date.now()}`,
    userId,
    text,
    read: false,
    timestamp: new Date().toISOString()
  };
  data.notifications.unshift(newNotif);
  updateSystemData(data);
};
