// Steigel Innovations Hub Central State Store
const STORE_KEY = 'steigel_system_data';
const SESSION_KEY = 'steigel_active_session';

// Helper: safe JSON parsing
const safeParse = (str, fallback) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Initial Seed Data
const defaultSystemData = {
  users: [
    { id: 'admin-1', name: 'System Administrator', email: 'admin@gmail.com', password: '123456', role: 'admin', level: 3, status: 'active', department: 'Executive', joined: '2025-01-01', phone: '+91 90000 00001' },
    { id: 'mentor-1', name: 'Faculty Tech Mentor', email: 'mentor@gmail.com', password: '123456', role: 'mentor', level: 2, status: 'active', department: 'AI & Robotics', joined: '2025-06-01', phone: '+91 94494 46793' },
    { id: 'intern-1', name: 'Software Engineering Associate', email: 'student@gmail.com', password: '123456', role: 'intern', level: 1, status: 'active', department: 'Software Engineering', batch: 'Batch A - 2026', joined: '2026-01-15', phone: '+91 99999 88888', ndaAccepted: true },
    { id: 'intern-2', name: 'Data Science Associate', email: 'intern2@gmail.com', password: '123456', role: 'intern', level: 1, status: 'active', department: 'Data Science', batch: 'Batch A - 2026', joined: '2026-01-15', phone: '+91 88888 77777', ndaAccepted: true },
    { id: 'intern-3', name: 'Cloud Operations Associate', email: 'intern3@gmail.com', password: '123456', role: 'intern', level: 1, status: 'active', department: 'Cloud Operations', batch: 'Batch B - 2026', joined: '2026-02-01', phone: '+91 77777 66666', ndaAccepted: true }
  ],
  mentors: [
    { id: 'mentor-1', name: 'Faculty Tech Mentor', email: 'mentor@gmail.com', department: 'AI & Robotics', assignedInterns: ['intern-1', 'intern-2'], activeProjects: ['proj-1', 'proj-2'], performance: '92%', status: 'active' }
  ],
  interns: [
    { id: 'intern-1', name: 'Software Engineering Associate', email: 'student@gmail.com', department: 'Software Engineering', batch: 'Batch A - 2026', status: 'active', mentorId: 'mentor-1', projectId: 'proj-1', attendanceScore: 92, taskProgress: 80, trainingProgress: 75, statusNotes: 'Exceeding expectations.', certificateStatus: 'eligible' },
    { id: 'intern-2', name: 'Data Science Associate', email: 'intern2@gmail.com', department: 'Data Science', batch: 'Batch A - 2026', status: 'active', mentorId: 'mentor-1', projectId: 'proj-2', attendanceScore: 88, taskProgress: 60, trainingProgress: 90, statusNotes: 'Solid analytical skills.', certificateStatus: 'none' },
    { id: 'intern-3', name: 'Cloud Operations Associate', email: 'intern3@gmail.com', department: 'Cloud Operations', batch: 'Batch B - 2026', status: 'active', mentorId: null, projectId: null, attendanceScore: 95, taskProgress: 0, trainingProgress: 40, statusNotes: 'Needs project allocation.', certificateStatus: 'none' }
  ],
  projects: [
    { id: 'proj-1', name: 'AI Copilot Core Development', description: 'Building the orchestration backend for contextual developer utilities.', problemStatement: 'Developer cognitive overload due to context switching.', department: 'Software Engineering', startDate: '2026-01-20', endDate: '2026-04-20', mentorId: 'mentor-1', assignedInterns: ['intern-1'], status: 'active', milestones: ['Setup codebase', 'Implement semantic indexing', 'Integrate LLM adapter', 'Performance profiling'] },
    { id: 'proj-2', name: 'Scalable Data Lake Architecture', description: 'Deploying high-throughput storage pipelines for petabyte-scale analysis.', problemStatement: 'Inefficient querying speed on unstructured log pipelines.', department: 'Data Science', startDate: '2026-02-01', endDate: '2026-05-01', mentorId: 'mentor-1', assignedInterns: ['intern-2'], status: 'active', milestones: ['S3 schema configuration', 'Glue jobs creation', 'Parquet optimization', 'Athena view tuning'] }
  ],
  tasks: [
    { id: 'task-1', title: 'Setup local workspace and repository hooks', description: 'Clone corporate repositories and configure pre-commit filters.', projectId: 'proj-1', assignedInternId: 'intern-1', mentorId: 'mentor-1', priority: 'high', deadline: '2026-02-10', status: 'completed', repositoryLink: 'https://github.com/steigel/copilot-core' },
    { id: 'task-2', title: 'Implement semantic vector search API', description: 'Write API endpoint mapping queries to semantic database.', projectId: 'proj-1', assignedInternId: 'intern-1', mentorId: 'mentor-1', priority: 'high', deadline: '2026-03-05', status: 'submitted', repositoryLink: 'https://github.com/steigel/copilot-core/pull/12' },
    { id: 'task-3', title: 'Optimize query parser execution times', description: 'Profile search router node metrics and decrease memory allocations.', projectId: 'proj-1', assignedInternId: 'intern-1', mentorId: 'mentor-1', priority: 'medium', deadline: '2026-09-15', status: 'in_progress', repositoryLink: '' },
    { id: 'task-4', title: 'Configure ETL schemas', description: 'Write JSON schema validation rules for input pipeline ingestion.', projectId: 'proj-2', assignedInternId: 'intern-2', mentorId: 'mentor-1', priority: 'high', deadline: '2026-02-25', status: 'completed', repositoryLink: 'https://github.com/steigel/datalake-etl' },
    { id: 'task-5', title: 'Write Glue jobs transformation tests', description: 'Create mocking utilities for PySpark scripts execution pipelines.', projectId: 'proj-2', assignedInternId: 'intern-2', mentorId: 'mentor-1', priority: 'medium', deadline: '2026-09-20', status: 'in_progress', repositoryLink: '' }
  ],
  submissions: [
    { id: 'sub-1', taskId: 'task-1', internId: 'intern-1', submittedDate: '2026-02-09', repositoryLink: 'https://github.com/steigel/copilot-core/commit/abc', comments: 'Setup done, all tests passed locally.', status: 'approved', feedback: 'Good job setting up the hooks correctly.' },
    { id: 'sub-2', taskId: 'task-2', internId: 'intern-1', submittedDate: '2026-03-04', repositoryLink: 'https://github.com/steigel/copilot-core/pull/12', comments: 'Added cosine similarity endpoints.', status: 'pending', feedback: '' },
    { id: 'sub-3', taskId: 'task-4', internId: 'intern-2', submittedDate: '2026-02-24', repositoryLink: 'https://github.com/steigel/datalake-etl/pull/1', comments: 'Schemas verified with test payloads.', status: 'approved', feedback: 'Verified. Clean implementation.' }
  ],
  attendance: [
    // Pre-seeded records for testing
    { date: '2026-08-25', internId: 'intern-1', status: 'present' },
    { date: '2026-08-25', internId: 'intern-2', status: 'present' },
    { date: '2026-08-25', internId: 'intern-3', status: 'absent' },
    { date: '2026-08-26', internId: 'intern-1', status: 'present' },
    { date: '2026-08-26', internId: 'intern-2', status: 'present' },
    { date: '2026-08-26', internId: 'intern-3', status: 'present' },
    { date: '2026-08-27', internId: 'intern-1', status: 'present' },
    { date: '2026-08-27', internId: 'intern-2', status: 'late' },
    { date: '2026-08-27', internId: 'intern-3', status: 'present' },
    { date: '2026-08-28', internId: 'intern-1', status: 'present' },
    { date: '2026-08-28', internId: 'intern-2', status: 'present' },
    { date: '2026-08-28', internId: 'intern-3', status: 'present' },
    { date: '2026-08-29', internId: 'intern-1', status: 'leave' },
    { date: '2026-08-29', internId: 'intern-2', status: 'present' },
    { date: '2026-08-29', internId: 'intern-3', status: 'present' }
  ],
  feedback: [
    { id: 'f-1', internId: 'intern-1', mentorId: 'mentor-1', mentorName: 'Dr. Vikram Sarabhai', text: 'Excellent progress on vectors math. Focus now on query cache layers.', date: '2026-08-28', priority: 'medium' },
    { id: 'f-2', internId: 'intern-2', mentorId: 'mentor-1', mentorName: 'Dr. Vikram Sarabhai', text: 'Review database indexes for faster query resolution in AWS Athena.', date: '2026-08-29', priority: 'high' }
  ],
  messages: [
    { id: 'msg-1', senderId: 'mentor-1', receiverId: 'intern-1', text: 'Hi Dhanush, how is the semantic search API coming along?', timestamp: '2026-08-30T10:00:00.000Z' },
    { id: 'msg-2', senderId: 'intern-1', receiverId: 'mentor-1', text: 'Hi Dr. Vikram, I just submitted the draft pull request. It uses standard cosine similarity on embeddings.', timestamp: '2026-08-30T10:15:00.000Z' }
  ],
  meetings: [
    { id: 'meet-1', title: 'Sprint Planning & Project Sync', date: '2026-09-02', time: '11:00 AM', description: 'Review milestone cards and next sprint priorities.', url: 'https://meet.google.com/abc-defg-hij', participants: ['intern-1', 'intern-2'], mentorId: 'mentor-1' }
  ],
  evaluations: [
    // Empty initially, filled by mentor
  ],
  certificates: [
    { id: 'cert-101', internId: 'intern-1', internName: 'Dhanush Ragava', title: 'Software Engineering Intern', startDate: '2026-01-15', endDate: '2026-04-15', issueDate: '2026-04-16', token: 'token-dhanush-123', hash: '87fa92305a415a774db8f2e21b34e5672abfde25c4ef6709825bcf7a6e11894d' }
  ],
  vault: [
    { id: 'folder-1', name: 'General Resources', type: 'folder', parentId: null, allowedRoles: ['admin', 'mentor', 'intern'] },
    { id: 'folder-2', name: 'Mentor Guides', type: 'folder', parentId: null, allowedRoles: ['admin', 'mentor'] },
    { id: 'file-1', name: 'Steigel_Intern_Manual.pdf', type: 'file', parentId: 'folder-1', size: '1.2 MB', uploadedDate: '2026-01-10', allowedRoles: ['admin', 'mentor', 'intern'], url: '#' },
    { id: 'file-2', name: 'Grading_Standard_Rubric.pdf', type: 'file', parentId: 'folder-2', size: '480 KB', uploadedDate: '2026-01-12', allowedRoles: ['admin', 'mentor'], url: '#' }
  ],
  auditLogs: [
    { id: 'log-1', action: 'SYSTEM_STARTUP', actor: 'System', actorId: 'system', timestamp: '2026-08-30T14:00:00.000Z', target: 'Core Database', metadata: 'Database system initiated.', ip: '127.0.0.1' }
  ],
  notifications: [
    { id: 'n-1', userId: 'intern-1', text: 'Welcome to Steigel Innovations Portal!', read: false, timestamp: '2026-08-30T10:00:00.000Z' }
  ],
  settings: {
    maintenanceMode: false,
    liveClassroom: null // { title: '...', url: '...', active: true/false }
  }
};

// Subscriptions callback list
let subscribers = [];

// Initialize Store
export const seedSystemData = (force = false) => {
  if (force || !localStorage.getItem(STORE_KEY)) {
    localStorage.setItem(STORE_KEY, JSON.stringify(defaultSystemData));
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
