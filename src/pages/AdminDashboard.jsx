import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, FolderGit2, FileCheck2, Award, FileSpreadsheet,
  Calendar, ShieldAlert, Settings2, BarChart3, Database, KeyRound,
  Plus, Edit2, Check, AlertCircle, Trash2, X, RefreshCw, Copy
} from 'lucide-react';
import { getSystemData, updateSystemData, getSession, logAudit, pushNotification } from '../lib/systemStore';
import DashboardLayout from '../components/DashboardLayout';
import StudentTable from '../components/StudentTable';
import ProgressBar from '../components/ProgressBar';
import TaskStatusChart from '../components/TaskStatusChart';
import { LineChart, BarChart, DoughnutChart } from '../components/Charts';
import '../components/auth.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [systemData, setSystemData] = useState(getSystemData());
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Modal States
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // User Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('intern');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('active');

  // CSV Import States
  const [csvFile, setCsvFile] = useState(null);
  const [csvRecords, setCsvRecords] = useState([]);
  const [csvStats, setCsvStats] = useState({ valid: 0, invalid: 0, duplicates: 0 });

  // Detail Modal States
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projProb, setProjProb] = useState('');
  const [projDept, setProjDept] = useState('');
  const [projStart, setProjStart] = useState('');
  const [projEnd, setProjEnd] = useState('');
  const [projMentor, setProjMentor] = useState('');
  const [projMilestones, setProjMilestones] = useState('');

  // Attendance correction
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [correctingAttendance, setCorrectingAttendance] = useState(null);
  const [correctedStatus, setCorrectedStatus] = useState('present');

  // Vault Management States
  const [vaultFolderName, setVaultFolderName] = useState('');
  const [vaultFolderRole, setVaultFolderRole] = useState('intern');

  // Audit Logs filters
  const [auditQuery, setAuditQuery] = useState('');

  // Maintenance confirm
  const [maintenanceConfirm, setMaintenanceConfirm] = useState(false);

  // Security guard check
  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession) {
      navigate('/admin-login');
      return;
    }
    if (activeSession.role !== 'admin') {
      navigate(activeSession.role === 'mentor' ? '/mentor-dashboard' : '/user-dashboard');
      return;
    }
    setUser(activeSession);
  }, [navigate]);

  // Sync state with store updates
  useEffect(() => {
    const handleUpdate = () => {
      setSystemData(getSystemData());
    };
    window.addEventListener('systemStoreUpdate', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('systemStoreUpdate', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const refreshData = () => {
    setSystemData(getSystemData());
  };

  // KPI calculations
  const totalInterns = systemData.interns.filter(i => i.status === 'active').length;
  const activeMentors = systemData.mentors.filter(m => m.status === 'active').length;
  const activeProjects = systemData.projects.filter(p => p.status === 'active').length;
  const pendingSubmissions = systemData.submissions.filter(s => s.status === 'pending').length;
  
  const completionRate = (() => {
    const completedTasks = systemData.tasks.filter(t => t.status === 'completed').length;
    const total = systemData.tasks.length;
    return total > 0 ? Math.round((completedTasks / total) * 100) : 0;
  })();

  const averageAttendance = (() => {
    const totalAtt = systemData.interns.reduce((acc, curr) => acc + (curr.attendanceScore || 0), 0);
    return systemData.interns.length > 0 ? Math.round(totalAtt / systemData.interns.length) : 0;
  })();

  const certificatesIssued = systemData.certificates.length;

  // Add / Edit User Handler
  const openUserModal = (usr = null) => {
    if (usr) {
      setEditingUser(usr);
      setFullName(usr.name);
      setEmail(usr.email);
      setPhone(usr.phone || '');
      setRole(usr.role);
      setDepartment(usr.department || '');
      setBatch(usr.batch || '');
      setJoiningDate(usr.joined || '');
      setPassword(usr.password);
      setStatus(usr.status);
    } else {
      setEditingUser(null);
      setFullName('');
      setEmail('');
      setPhone('');
      setRole('intern');
      setDepartment('');
      setBatch('');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setPassword('123456');
      setStatus('active');
    }
    setUserModalOpen(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) return;

    const data = getSystemData();
    const existingUserIndex = data.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (!editingUser && existingUserIndex !== -1) {
      alert('A user with this email address already exists.');
      return;
    }

    if (editingUser) {
      // Update User
      data.users = data.users.map(u => {
        if (u.id === editingUser.id) {
          return { ...u, name: fullName, email, phone, role, department, batch, joined: joiningDate, password, status };
        }
        return u;
      });

      // Synchronize in role-specific lists
      if (role === 'intern') {
        data.interns = data.interns.map(i => {
          if (i.id === editingUser.id) {
            return { ...i, name: fullName, email, department, batch, status };
          }
          return i;
        });
      } else if (role === 'mentor') {
        data.mentors = data.mentors.map(m => {
          if (m.id === editingUser.id) {
            return { ...m, name: fullName, email, department, status };
          }
          return m;
        });
      }

      logAudit('USER_UPDATED', user.name, user.id, `User ${fullName}`, { id: editingUser.id });
    } else {
      // Create User
      const newId = `${role}-${Date.now()}`;
      const newUser = { id: newId, name: fullName, email, phone, role, level: role === 'admin' ? 3 : role === 'mentor' ? 2 : 1, status, joined: joiningDate, password, ndaAccepted: false, department, batch };
      data.users.push(newUser);

      if (role === 'intern') {
        data.interns.push({
          id: newId, name: fullName, email, department, batch, status,
          mentorId: null, projectId: null, attendanceScore: 100, taskProgress: 0, trainingProgress: 0, statusNotes: 'Initiated'
        });
      } else if (role === 'mentor') {
        data.mentors.push({
          id: newId, name: fullName, email, department, assignedInterns: [], activeProjects: [], performance: '100%', status
        });
      }

      logAudit('USER_CREATED', user.name, user.id, `User ${fullName}`, { id: newId, role });
    }

    updateSystemData(data);
    setUserModalOpen(false);
  };

  const handleDeactivate = (userId, newStatus) => {
    const data = getSystemData();
    data.users = data.users.map(u => u.id === userId ? { ...u, status: newStatus } : u);
    data.interns = data.interns.map(i => i.id === userId ? { ...i, status: newStatus } : i);
    data.mentors = data.mentors.map(m => m.id === userId ? { ...m, status: newStatus } : m);
    
    updateSystemData(data);
    logAudit(newStatus === 'inactive' ? 'USER_DEACTIVATED' : 'USER_ACTIVATED', user.name, user.id, `User ID: ${userId}`);
  };

  const handleSoftDelete = (userId) => {
    if (!window.confirm('Are you sure you want to soft delete this user?')) return;
    const data = getSystemData();
    
    data.users = data.users.filter(u => u.id !== userId);
    data.interns = data.interns.filter(i => i.id !== userId);
    data.mentors = data.mentors.filter(m => m.id !== userId);

    updateSystemData(data);
    logAudit('USER_DELETED', user.name, user.id, `User ID: ${userId}`);
  };

  // CSV Import Parser
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) return;

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const records = [];
      let valid = 0, invalid = 0, duplicates = 0;
      const currentEmails = systemData.users.map(u => u.email.toLowerCase());
      const parsedEmails = new Set();

      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',').map(c => c.trim());
        const row = {};
        headers.forEach((h, index) => {
          row[h] = columns[index] || '';
        });

        // Basic verification
        const recordName = row.name || row.fullname;
        const recordEmail = row.email;
        const recordRole = (row.role || 'intern').toLowerCase();
        
        let errors = [];
        if (!recordName) errors.push('Missing Name');
        if (!recordEmail) {
          errors.push('Missing Email');
        } else if (!/\S+@\S+\.\S+/.test(recordEmail)) {
          errors.push('Invalid Email Format');
        } else if (currentEmails.includes(recordEmail.toLowerCase()) || parsedEmails.has(recordEmail.toLowerCase())) {
          errors.push('Duplicate Email');
          duplicates++;
        }

        if (errors.length > 0) {
          invalid++;
        } else {
          valid++;
          parsedEmails.add(recordEmail.toLowerCase());
        }

        records.push({
          name: recordName || 'N/A',
          email: recordEmail || 'N/A',
          phone: row.phone || '',
          role: ['admin', 'mentor', 'intern'].includes(recordRole) ? recordRole : 'intern',
          department: row.department || '',
          batch: row.batch || '',
          joined: row.joined || row.joiningdate || new Date().toISOString().split('T')[0],
          password: row.password || '123456',
          errors
        });
      }

      setCsvRecords(records);
      setCsvStats({ valid, invalid, duplicates });
    };
    reader.readAsText(file);
  };

  const confirmCsvImport = () => {
    const data = getSystemData();
    let importCount = 0;

    csvRecords.forEach(rec => {
      if (rec.errors.length === 0) {
        const newId = `${rec.role}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newUser = {
          id: newId, name: rec.name, email: rec.email, phone: rec.phone,
          role: rec.role, level: rec.role === 'admin' ? 3 : rec.role === 'mentor' ? 2 : 1,
          status: 'active', joined: rec.joined, password: rec.password, ndaAccepted: false,
          department: rec.department, batch: rec.batch
        };
        data.users.push(newUser);

        if (rec.role === 'intern') {
          data.interns.push({
            id: newId, name: rec.name, email: rec.email, department: rec.department, batch: rec.batch, status: 'active',
            mentorId: null, projectId: null, attendanceScore: 100, taskProgress: 0, trainingProgress: 0, statusNotes: 'Imported'
          });
        } else if (rec.role === 'mentor') {
          data.mentors.push({
            id: newId, name: rec.name, email: rec.email, department: rec.department, assignedInterns: [], activeProjects: [], performance: '100%', status: 'active'
          });
        }
        importCount++;
      }
    });

    updateSystemData(data);
    logAudit('USERS_BULK_IMPORT', user.name, user.id, `Imported ${importCount} users`);
    alert(`Successfully imported ${importCount} user records.`);
    setCsvFile(null);
    setCsvRecords([]);
    setCsvStats({ valid: 0, invalid: 0, duplicates: 0 });
  };

  // Project Creation
  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (!projName.trim() || !projDesc.trim() || !projDept) return;

    const data = getSystemData();
    const newProj = {
      id: `proj-${Date.now()}`,
      name: projName,
      description: projDesc,
      problemStatement: projProb,
      department: projDept,
      startDate: projStart || new Date().toISOString().split('T')[0],
      endDate: projEnd || '',
      mentorId: projMentor || null,
      assignedInterns: [],
      status: 'active',
      milestones: projMilestones.split(',').map(m => m.trim()).filter(Boolean)
    };

    data.projects.push(newProj);

    // Update mentor active project lists
    if (projMentor) {
      data.mentors = data.mentors.map(m => {
        if (m.id === projMentor) {
          return { ...m, activeProjects: [...new Set([...m.activeProjects, newProj.id])] };
        }
        return m;
      });
    }

    updateSystemData(data);
    logAudit('PROJECT_CREATED', user.name, user.id, `Project: ${projName}`);
    setProjectModalOpen(false);
    
    // reset fields
    setProjName(''); setProjDesc(''); setProjProb(''); setProjDept(''); setProjStart(''); setProjEnd(''); setProjMentor(''); setProjMilestones('');
  };

  // Mentor Assignment Actions
  const handleAssignMentor = (internId, mentorId) => {
    const data = getSystemData();
    
    // Assign mentor to intern
    data.interns = data.interns.map(i => {
      if (i.id === internId) {
        return { ...i, mentorId };
      }
      return i;
    });

    // Add intern to mentor roster
    data.mentors = data.mentors.map(m => {
      if (m.id === mentorId) {
        return { ...m, assignedInterns: [...new Set([...m.assignedInterns, internId])] };
      } else {
        // Remove from old mentor roster
        return { ...m, assignedInterns: m.assignedInterns.filter(id => id !== internId) };
      }
    });

    updateSystemData(data);
    const internName = data.interns.find(i => i.id === internId)?.name || 'Intern';
    const mentorName = data.mentors.find(m => m.id === mentorId)?.name || 'Mentor';
    logAudit('MENTOR_ASSIGNED', user.name, user.id, `Mentor ${mentorName} assigned to ${internName}`);
    pushNotification(internId, `Admin assigned mentor: ${mentorName}`);
  };

  // Attendance correction
  const handleAttendanceChange = (internId, date, status) => {
    const data = getSystemData();
    const index = data.attendance.findIndex(a => a.internId === internId && a.date === date);

    if (index !== -1) {
      data.attendance[index].status = status;
    } else {
      data.attendance.push({ date, internId, status });
    }

    updateSystemData(data);
    const internName = data.interns.find(i => i.id === internId)?.name || 'Intern';
    logAudit('ATTENDANCE_CORRECTED', user.name, user.id, `Attendance corrected for ${internName} on ${date}`);
  };

  // Certificate Issuance
  const handleIssueCertificate = (intern) => {
    const data = getSystemData();
    
    // Check duplication
    const exists = data.certificates.some(c => c.internId === intern.id);
    if (exists) {
      alert('Certificate already issued for this intern.');
      return;
    }

    const token = `token-${intern.id}-${Date.now()}`;
    const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''); // Dummy SHA-256
    const proj = data.projects.find(p => p.id === intern.projectId);

    const newCert = {
      id: `cert-${Date.now()}`,
      internId: intern.id,
      internName: intern.name,
      title: proj ? `${proj.department} Associate` : 'General Intern',
      startDate: intern.joiningDate || '2026-01-15',
      endDate: new Date().toISOString().split('T')[0],
      issueDate: new Date().toISOString().split('T')[0],
      token,
      hash
    };

    data.certificates.push(newCert);
    
    // Update eligibility flag
    data.interns = data.interns.map(i => i.id === intern.id ? { ...i, certificateStatus: 'issued' } : i);

    updateSystemData(data);
    logAudit('CERTIFICATE_ISSUED', user.name, user.id, `Certificate for ${intern.name}`);
    pushNotification(intern.id, `Congratulations! Your certificate of completion has been issued by Admin.`);
  };

  const handleRevokeCertificate = (certId) => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
    const data = getSystemData();
    const cert = data.certificates.find(c => c.id === certId);
    
    data.certificates = data.certificates.filter(c => c.id !== certId);
    if (cert) {
      data.interns = data.interns.map(i => i.id === cert.internId ? { ...i, certificateStatus: 'eligible' } : i);
    }

    updateSystemData(data);
    logAudit('CERTIFICATE_REVOKED', user.name, user.id, `Revoked Certificate ID: ${certId}`);
  };

  // Directory creations
  const handleCreateDirectory = (e) => {
    e.preventDefault();
    if (!vaultFolderName.trim()) return;

    const data = getSystemData();
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: vaultFolderName,
      type: 'folder',
      parentId: null,
      allowedRoles: vaultFolderRole === 'all' ? ['admin', 'mentor', 'intern'] : vaultFolderRole === 'mentor' ? ['admin', 'mentor'] : ['admin']
    };

    data.vault.push(newFolder);
    updateSystemData(data);
    logAudit('VAULT_FOLDER_CREATED', user.name, user.id, `Folder: ${vaultFolderName}`);
    setVaultFolderName('');
  };

  const handleSoftDeleteVaultItem = (itemId) => {
    const data = getSystemData();
    data.vault = data.vault.filter(v => v.id !== itemId);
    updateSystemData(data);
    logAudit('VAULT_ITEM_DELETED', user.name, user.id, `Item ID: ${itemId}`);
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = () => {
    if (!maintenanceConfirm) {
      alert('Please check the confirmation box before toggling maintenance mode.');
      return;
    }

    const data = getSystemData();
    const currentMode = data.settings.maintenanceMode;
    data.settings.maintenanceMode = !currentMode;
    updateSystemData(data);
    
    logAudit(
      !currentMode ? 'MAINTENANCE_ENABLED' : 'MAINTENANCE_DISABLED',
      user.name,
      user.id,
      'System Settings'
    );
    setMaintenanceConfirm(false);
  };

  // Nav side items for layout
  const sidebarItems = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Users', icon: Users },
    { name: 'Mentors', icon: UserCheck },
    { name: 'Interns', icon: Users },
    { name: 'Projects', icon: FolderGit2 },
    { name: 'Tasks', icon: FileCheck2 },
    { name: 'Attendance', icon: Calendar },
    { name: 'Certificates', icon: Award },
    { name: 'Vault', icon: Database },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Audit Logs', icon: KeyRound },
    { name: 'Maintenance', icon: Settings2 }
  ];

  return (
    <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} menuItems={sidebarItems}>
      
      {/* 1. TABS CONTENT: DASHBOARD HOME */}
      {activeTab === 'Dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Stats Bar */}
          <div className="dash-grid-stats">
            <div className="dash-card">
              <span className="kpi-label">Total Interns</span>
              <div className="kpi-value">{totalInterns}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Active Mentors</span>
              <div className="kpi-value">{activeMentors}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Active Projects</span>
              <div className="kpi-value">{activeProjects}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Pending Reviews</span>
              <div className="kpi-value">{pendingSubmissions}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Task Completion</span>
              <div className="kpi-value">{completionRate}%</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Avg Attendance</span>
              <div className="kpi-value">{averageAttendance}%</div>
            </div>
          </div>

          {/* Core Analytics charts */}
          <div className="dash-grid-charts">
            <div className="dash-card">
              <span style={{ fontWeight: 700 }}>Task Completion Statuses</span>
              <TaskStatusChart tasks={systemData.tasks} />
            </div>

            <div className="dash-card">
              <span style={{ fontWeight: 700 }}>Intern Growth Trend</span>
              <LineChart
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  datasets: [{
                    label: 'Cohort Size',
                    data: [5, 12, 18, 25, 24, 30, 35, systemData.users.filter(u => u.role === 'intern').length],
                    borderColor: '#B8923D',
                    backgroundColor: 'rgba(184, 146, 61, 0.08)',
                    fill: true
                  }]
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. TABS CONTENT: USERS DIRECTORY */}
      {activeTab === 'Users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>Cohort & Staff Directory</span>
            <button className="dash-btn dash-btn-primary" onClick={() => openUserModal()}>
              <Plus size={16} /> Add User
            </button>
          </div>

          <StudentTable
            columns={[
              { key: 'name', title: 'Full Name' },
              { key: 'email', title: 'Email Address' },
              { key: 'role', title: 'Access Role', render: (val) => <span style={{ textTransform: 'capitalize' }}>{val}</span> },
              { key: 'department', title: 'Department' },
              { key: 'status', title: 'Status', render: (val) => <span className={`status-badge ${val}`}>{val}</span> }
            ]}
            data={systemData.users}
            searchField="name"
            filterOptions={{
              field: 'role',
              label: 'Filter Role',
              options: [
                { value: 'admin', label: 'Admin' },
                { value: 'mentor', label: 'Mentor' },
                { value: 'intern', label: 'Intern' }
              ]
            }}
            actions={(row) => (
              <>
                <button className="dash-btn dash-btn-secondary" style={{ padding: '0.4rem' }} onClick={() => openUserModal(row)}>
                  <Edit2 size={14} />
                </button>
                {row.status === 'active' ? (
                  <button className="dash-btn dash-btn-secondary" style={{ padding: '0.4rem', color: 'var(--warning)' }} onClick={() => handleDeactivate(row.id, 'inactive')}>
                    Deactivate
                  </button>
                ) : (
                  <button className="dash-btn dash-btn-secondary" style={{ padding: '0.4rem', color: 'var(--success)' }} onClick={() => handleDeactivate(row.id, 'active')}>
                    Activate
                  </button>
                )}
                <button className="dash-btn dash-btn-danger" style={{ padding: '0.4rem' }} onClick={() => handleSoftDelete(row.id)}>
                  <Trash2 size={14} />
                </button>
              </>
            )}
          />

          {/* Bulk CSV Upload Card */}
          <div className="dash-card" style={{ marginTop: '1.5rem' }}>
            <div className="dash-card-header">
              <span className="dash-card-title">Bulk User Import (CSV)</span>
              <FileSpreadsheet size={18} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Upload a comma-separated values (.csv) file. Header columns should match: 
                <code style={{ background: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', margin: '0 0.5rem' }}>name, email, phone, role, department, batch, password</code>
              </p>

              <input type="file" accept=".csv" onChange={handleCsvUpload} className="dash-input" style={{ width: 'auto' }} />

              {csvRecords.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
                    <span>Valid Records: <strong style={{ color: 'var(--success)' }}>{csvStats.valid}</strong></span>
                    <span>Errors Found: <strong style={{ color: 'var(--error)' }}>{csvStats.invalid}</strong></span>
                    <span>Duplicate Emails: <strong style={{ color: 'var(--warning)' }}>{csvStats.duplicates}</strong></span>
                  </div>

                  {/* Preview Table */}
                  <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Errors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvRecords.map((r, i) => (
                          <tr key={i}>
                            <td>{r.name}</td>
                            <td>{r.email}</td>
                            <td>{r.role}</td>
                            <td style={{ color: 'var(--error)', fontSize: '0.8rem' }}>
                              {r.errors.length > 0 ? r.errors.join(', ') : <span style={{ color: 'var(--success)' }}>Valid</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" className="dash-btn dash-btn-secondary" onClick={() => { setCsvRecords([]); setCsvFile(null); }}>Clear</button>
                    <button type="button" className="dash-btn dash-btn-primary" disabled={csvStats.valid === 0} onClick={confirmCsvImport}>
                      Confirm Bulk Creation ({csvStats.valid} users)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. TABS CONTENT: MENTORS */}
      {activeTab === 'Mentors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Faculty Officers</span>
          
          <StudentTable
            columns={[
              { key: 'name', title: 'Faculty Name' },
              { key: 'email', title: 'Email Address' },
              { key: 'department', title: 'Department' },
              { 
                key: 'assignedInterns', 
                title: 'Assigned Interns', 
                render: (val = []) => {
                  return val.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {val.map(id => {
                        const internName = systemData.interns.find(i => i.id === id)?.name || id;
                        return <span key={id} style={{ fontSize: '0.75rem', backgroundColor: 'var(--hover-bg)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{internName}</span>;
                      })}
                    </div>
                  ) : <span style={{ color: 'var(--text-muted)' }}>No interns</span>;
                }
              },
              { key: 'activeProjects', title: 'Active Projects', render: (val = []) => val.length }
            ]}
            data={systemData.mentors}
            searchField="name"
          />
        </div>
      )}

      {/* 4. TABS CONTENT: INTERNS PROGRESS */}
      {activeTab === 'Interns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Cohort Associates Progress Tracker</span>

          <StudentTable
            columns={[
              { key: 'name', title: 'Intern Name' },
              { key: 'batch', title: 'Cohort Batch' },
              { 
                key: 'mentorId', 
                title: 'Assigned Mentor', 
                render: (val, row) => {
                  return (
                    <select
                      className="dash-select"
                      value={val || ''}
                      onChange={(e) => handleAssignMentor(row.id, e.target.value)}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      <option value="">No Mentor</option>
                      {systemData.mentors.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  );
                } 
              },
              { 
                key: 'taskProgress', 
                title: 'Task Progress', 
                render: (val) => <ProgressBar progress={val} label={null} color="var(--text-primary)" />
              },
              { 
                key: 'trainingProgress', 
                title: 'Training Progress', 
                render: (val) => <ProgressBar progress={val} label={null} color="#A0A8B1" />
              },
              { key: 'attendanceScore', title: 'Attendance', render: (val) => `${val || 0}%` }
            ]}
            data={systemData.interns}
            searchField="name"
            actions={(row) => (
              <button className="dash-btn dash-btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setSelectedIntern(row)}>
                View Detail Profile
              </button>
            )}
          />
        </div>
      )}

      {/* 5. TABS CONTENT: PROJECTS */}
      {activeTab === 'Projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>Development Projects</span>
            <button className="dash-btn dash-btn-primary" onClick={() => setProjectModalOpen(true)}>
              <Plus size={16} /> Create Project
            </button>
          </div>

          <StudentTable
            columns={[
              { key: 'name', title: 'Project Name' },
              { key: 'department', title: 'Department' },
              { key: 'startDate', title: 'Start Date' },
              { key: 'endDate', title: 'Target End Date' },
              { 
                key: 'mentorId', 
                title: 'Supervisor', 
                render: (val) => systemData.mentors.find(m => m.id === val)?.name || 'Unassigned' 
              },
              { key: 'status', title: 'Status', render: (val) => <span className={`status-badge ${val}`}>{val}</span> }
            ]}
            data={systemData.projects}
            searchField="name"
          />
        </div>
      )}

      {/* 6. TABS CONTENT: TASKS */}
      {activeTab === 'Tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Assigned Workspace Tasks</span>

          <StudentTable
            columns={[
              { key: 'title', title: 'Task Title' },
              { key: 'assignedInternId', title: 'Intern', render: (val) => systemData.interns.find(i => i.id === val)?.name || 'N/A' },
              { key: 'priority', title: 'Priority', render: (val) => <span style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: val === 'high' ? 'var(--error)' : val === 'medium' ? 'var(--warning)' : 'var(--text-muted)' }}>{val}</span> },
              { key: 'deadline', title: 'Deadline' },
              { key: 'status', title: 'Status', render: (val) => <span className={`status-badge ${val}`}>{val}</span> },
              { key: 'repositoryLink', title: 'Deliverable Link', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>View Pull Request</a> : 'N/A' }
            ]}
            data={systemData.tasks}
            searchField="title"
          />
        </div>
      )}

      {/* 7. TABS CONTENT: ATTENDANCE */}
      {activeTab === 'Attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontWeight: 700 }}>Daily Cohort Attendance Logs</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Selected Date:</span>
              <input type="date" className="dash-input" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} style={{ width: 'auto' }} />
            </div>
          </div>

          <StudentTable
            columns={[
              { key: 'name', title: 'Associate Name' },
              { key: 'batch', title: 'Cohort Batch' },
              {
                key: 'id',
                title: 'Attendance Status',
                render: (val, row) => {
                  const record = systemData.attendance.find(a => a.internId === row.id && a.date === attendanceDate);
                  const attStatus = record ? record.status : 'N/A';
                  return <span className={`status-badge ${attStatus.toLowerCase()}`}>{attStatus}</span>;
                }
              }
            ]}
            data={systemData.interns}
            searchField="name"
            actions={(row) => {
              const record = systemData.attendance.find(a => a.internId === row.id && a.date === attendanceDate);
              const attStatus = record ? record.status : 'absent';
              return (
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {['present', 'absent', 'late', 'leave'].map(s => (
                    <button
                      key={s}
                      className="dash-btn"
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.7rem',
                        backgroundColor: attStatus === s ? 'var(--text-primary)' : 'transparent',
                        borderColor: 'var(--border-color)',
                        color: attStatus === s ? '#FFFFFF' : 'var(--text-primary)'
                      }}
                      onClick={() => handleAttendanceChange(row.id, attendanceDate, s)}
                    >
                      {s.substring(0, 1).toUpperCase() + s.substring(1)}
                    </button>
                  ))}
                </div>
              );
            }}
          />
        </div>
      )}

      {/* 8. TABS CONTENT: CERTIFICATES ISSUANCE */}
      {activeTab === 'Certificates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Internship Completion Certificates</span>

          <div className="dash-card">
            <span style={{ fontWeight: 700 }}>Eligible & Completed Candidates</span>
            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Associate Name</th>
                    <th>Cohort Batch</th>
                    <th>Attendance Rating</th>
                    <th>Task Progress</th>
                    <th>Training Rating</th>
                    <th>Certificate ID</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {systemData.interns.map(i => {
                    const certObj = systemData.certificates.find(c => c.internId === i.id);
                    return (
                      <tr key={i.id}>
                        <td>{i.name}</td>
                        <td>{i.batch}</td>
                        <td>{i.attendanceScore}%</td>
                        <td>{i.taskProgress}%</td>
                        <td>{i.trainingProgress}%</td>
                        <td style={{ fontFamily: 'monospace' }}>{certObj ? certObj.id : 'Not Issued'}</td>
                        <td style={{ textAlign: 'right' }}>
                          {certObj ? (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <button
                                className="dash-btn dash-btn-secondary"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                                onClick={() => {
                                  const link = `${window.location.origin}/verify/${certObj.token}`;
                                  navigator.clipboard.writeText(link);
                                  alert('Verification link copied to clipboard!');
                                }}
                              >
                                <Copy size={12} /> Copy Link
                              </button>
                              <button
                                className="dash-btn dash-btn-danger"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                                onClick={() => handleRevokeCertificate(certObj.id)}
                              >
                                Revoke
                              </button>
                            </div>
                          ) : (
                            <button
                              className="dash-btn dash-btn-primary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                              onClick={() => handleIssueCertificate(i)}
                            >
                              Issue Credential
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. TABS CONTENT: VAULT ADMIN */}
      {activeTab === 'Vault' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Corporate Document Vault Management</span>

          {/* Directory creation form */}
          <div className="dash-card">
            <span style={{ fontWeight: 700 }}>Create Secure Directory</span>
            <form onSubmit={handleCreateDirectory} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flexGrow: 1, minWidth: '200px', marginBottom: 0 }}>
                <label className="form-label">Directory Folder Name</label>
                <input
                  type="text"
                  className="dash-input"
                  placeholder="e.g. Design Handover Specs"
                  value={vaultFolderName}
                  onChange={e => setVaultFolderName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ width: '200px', marginBottom: 0 }}>
                <label className="form-label">Access Level Constraint</label>
                <select className="dash-select" value={vaultFolderRole} onChange={e => setVaultFolderRole(e.target.value)}>
                  <option value="intern">Intern & Faculty (All)</option>
                  <option value="mentor">Faculty & Admin Only</option>
                  <option value="admin">Admin Only</option>
                </select>
              </div>

              <button type="submit" className="dash-btn dash-btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                <Plus size={16} /> Create Folder
              </button>
            </form>
          </div>

          {/* Directory List Table */}
          <div className="dash-card">
            <span style={{ fontWeight: 700 }}>Directories and files registry</span>
            <StudentTable
              columns={[
                { key: 'name', title: 'File/Folder Name' },
                { key: 'type', title: 'Type', render: (val) => <span style={{ textTransform: 'capitalize' }}>{val}</span> },
                { key: 'allowedRoles', title: 'Allowed Access Roles', render: (val = []) => val.join(', ').toUpperCase() },
                { key: 'size', title: 'Size', render: (val) => val || 'N/A' },
                { key: 'uploadedDate', title: 'Uploaded Date', render: (val) => val || 'N/A' }
              ]}
              data={systemData.vault}
              searchField="name"
              actions={(row) => (
                <button className="dash-btn dash-btn-danger" style={{ padding: '0.4rem' }} onClick={() => handleSoftDeleteVaultItem(row.id)}>
                  <Trash2 size={14} />
                </button>
              )}
            />
          </div>
        </div>
      )}

      {/* 10. TABS CONTENT: ANALYTICS REPORTS */}
      {activeTab === 'Analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Full-Scale Analytics Center</span>

          <div className="dash-grid-charts">
            <div className="dash-card">
              <span style={{ fontWeight: 700 }}>Task Completion Status Distribution</span>
              <TaskStatusChart tasks={systemData.tasks} />
            </div>

            <div className="dash-card">
              <span style={{ fontWeight: 700 }}>Weekly Attendance Trends</span>
              <BarChart
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                  datasets: [{
                    label: 'Present Ratio %',
                    data: [90, 85, 95, 92, 88],
                    backgroundColor: '#B8923D'
                  }]
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 11. TABS CONTENT: IMMUTABLE AUDIT LOG */}
      {activeTab === 'Audit Logs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>System Integrity Audit Trails</span>

          <div style={{ display: 'flex', gap: '1rem', maxWidth: '350px' }}>
            <input
              type="text"
              className="dash-input"
              placeholder="Search actions or actors..."
              value={auditQuery}
              onChange={e => setAuditQuery(e.target.value)}
            />
          </div>

          <div className="table-responsive" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Action Node</th>
                  <th>Actor</th>
                  <th>Target Node</th>
                  <th>Simulated IP</th>
                  <th>Timestamp</th>
                  <th>Metadata</th>
                </tr>
              </thead>
              <tbody>
                {systemData.auditLogs
                  .filter(l => 
                    l.action.toLowerCase().includes(auditQuery.toLowerCase()) ||
                    l.actor.toLowerCase().includes(auditQuery.toLowerCase())
                  )
                  .map(log => (
                    <tr key={log.id}>
                      <td style={{ fontWeight: 700 }}>{log.action}</td>
                      <td>{log.actor} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({log.actorId})</span></td>
                      <td>{log.target}</td>
                      <td style={{ fontFamily: 'monospace' }}>{log.simulatedIp}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{JSON.stringify(log.metadata)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 12. TABS CONTENT: MAINTENANCE CONTROLLER */}
      {activeTab === 'Maintenance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
          <span style={{ fontWeight: 700 }}>Core System Configurations</span>

          <div className="dash-card" style={{ borderColor: systemData.settings.maintenanceMode ? 'var(--error)' : 'var(--border-color)' }}>
            <div className="dash-card-header">
              <span className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert color={systemData.settings.maintenanceMode ? 'var(--error)' : 'var(--text-primary)'} />
                Maintenance Mode Gate
              </span>
              <span className={`status-badge ${systemData.settings.maintenanceMode ? 'inactive' : 'active'}`}>
                {systemData.settings.maintenanceMode ? 'Under Maintenance' : 'Live Operations'}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Enabling system maintenance will immediately suspend active login dashboards for all **Mentors (Level 2)** and **Interns (Level 1)**. 
              They will be redirected to the offline system maintenance screen. Admins retain full, bypass access.
            </p>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={maintenanceConfirm} 
                  onChange={e => setMaintenanceConfirm(e.target.checked)} 
                  style={{ marginTop: '3px' }}
                />
                <span>I confirm that enabling maintenance mode blocks dashboard access for all staff and students.</span>
              </label>

              <button
                type="button"
                onClick={handleToggleMaintenance}
                disabled={!maintenanceConfirm}
                className={`dash-btn ${systemData.settings.maintenanceMode ? 'dash-btn-primary' : 'dash-btn-danger'}`}
                style={{ width: 'fit-content', opacity: maintenanceConfirm ? 1 : 0.5 }}
              >
                {systemData.settings.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODALS & DRAWER RENDER PANELS
          ========================================== */}

      {/* User Add/Edit Modal */}
      {userModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">{editingUser ? 'Edit User Record' : 'Create Staff/Student User'}</h3>
              <button className="modal-close-btn" onClick={() => setUserModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleUserSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="dash-input" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>

                <div className="dash-form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="dash-input" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="dash-input" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>

                <div className="dash-form-row">
                  <div className="form-group">
                    <label className="form-label">Portal Access Role *</label>
                    <select className="dash-select" value={role} onChange={e => setRole(e.target.value)}>
                      <option value="admin">Level 3 — System Admin</option>
                      <option value="mentor">Level 2 — Academic Mentor</option>
                      <option value="intern">Level 1 — Intern Associate</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input type="text" className="dash-input" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Data Engineering" />
                  </div>
                </div>

                {role === 'intern' && (
                  <div className="form-group">
                    <label className="form-label">Cohort Batch *</label>
                    <input type="text" className="dash-input" value={batch} onChange={e => setBatch(e.target.value)} placeholder="e.g. Batch A - 2026" required />
                  </div>
                )}

                <div className="dash-form-row">
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input type="text" className="dash-input" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Joining Date</label>
                    <input type="date" className="dash-input" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="dash-select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="dash-btn dash-btn-secondary" onClick={() => setUserModalOpen(false)}>Cancel</button>
                <button type="submit" className="dash-btn dash-btn-primary">{editingUser ? 'Save Changes' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Intern Detailed Profile Modal */}
      {selectedIntern && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Student Intern Record: {selectedIntern.name}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedIntern(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ fontSize: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Email:</span> {selectedIntern.email}
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Department:</span> {selectedIntern.department || 'N/A'}
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Cohort Batch:</span> {selectedIntern.batch || 'N/A'}
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span> <span className={`status-badge ${selectedIntern.status}`}>{selectedIntern.status}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>Ratings and Progress Metrics</span>
                <ProgressBar progress={selectedIntern.taskProgress} label="Task Completion Ratio" />
                <ProgressBar progress={selectedIntern.trainingProgress} label="Training Modules Progress" color="#6A727C" />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                  <div className="dash-card" style={{ padding: '1rem' }}>
                    <span className="kpi-label" style={{ fontSize: '0.7rem' }}>Attendance Rate</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedIntern.attendanceScore}%</div>
                  </div>
                  <div className="dash-card" style={{ padding: '1rem' }}>
                    <span className="kpi-label" style={{ fontSize: '0.7rem' }}>Credential Status</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: selectedIntern.certificateStatus === 'issued' ? 'var(--success)' : 'var(--text-muted)' }}>
                      {selectedIntern.certificateStatus}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>Academic Mentor Comments & Remarks</span>
                <p style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '0.5rem', fontStyle: 'italic', fontSize: '0.85rem' }}>
                  {selectedIntern.statusNotes || 'No notes written yet.'}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="dash-btn dash-btn-primary" onClick={() => setSelectedIntern(null)}>Close Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {projectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Create Development Project</h3>
              <button className="modal-close-btn" onClick={() => setProjectModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleProjectSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Project Name *</label>
                  <input type="text" className="dash-input" value={projName} onChange={e => setProjName(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Project Description *</label>
                  <textarea className="dash-textarea" value={projDesc} onChange={e => setProjDesc(e.target.value)} rows={3} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Problem Statement *</label>
                  <input type="text" className="dash-input" value={projProb} onChange={e => setProjProb(e.target.value)} required />
                </div>

                <div className="dash-form-row">
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <input type="text" className="dash-input" value={projDept} onChange={e => setProjDept(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Supervisor Mentor</label>
                    <select className="dash-select" value={projMentor} onChange={e => setProjMentor(e.target.value)}>
                      <option value="">Select Mentor</option>
                      {systemData.mentors.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="dash-form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="date" className="dash-input" value={projStart} onChange={e => setProjStart(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="date" className="dash-input" value={projEnd} onChange={e => setProjEnd(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Milestones (Comma-separated)</label>
                  <input type="text" className="dash-input" value={projMilestones} onChange={e => setProjMilestones(e.target.value)} placeholder="e.g. Repository Init, API Setup, Review" />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="dash-btn dash-btn-secondary" onClick={() => setProjectModalOpen(false)}>Cancel</button>
                <button type="submit" className="dash-btn dash-btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AdminDashboard;
