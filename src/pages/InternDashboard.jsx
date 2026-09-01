import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, FolderGit2, FileText, ClipboardList, BookOpen, MessageSquare,
  Calendar, Award, MessageCircle, BarChart3, ShieldAlert, KeyRound,
  Download, ExternalLink, Check, Eye, X
} from 'lucide-react';
import { getSystemData, updateSystemData, getSession, logAudit } from '../lib/systemStore';
import DashboardLayout from '../components/DashboardLayout';
import StudentTable from '../components/StudentTable';
import ChatBox from '../components/ChatBox';
import ProgressBar from '../components/ProgressBar';
import '../components/auth.css';

export const InternDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [systemData, setSystemData] = useState(getSystemData());
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Submit Modal Gateway State
  const [submittingTaskId, setSubmittingTaskId] = useState('');
  const [submitRepo, setSubmitRepo] = useState('');
  const [submitComments, setSubmitComments] = useState('');

  // Certificate Modal State
  const [viewingCertificate, setViewingCertificate] = useState(null);

  // Security checks
  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession) {
      navigate('/user-login');
      return;
    }
    if (activeSession.role !== 'intern') {
      navigate(activeSession.role === 'admin' ? '/admin-dashboard' : '/mentor-dashboard');
      return;
    }
    if (activeSession.ndaAccepted === false) {
      navigate('/nda-agreement');
      return;
    }
    // Maintenance Mode redirect
    const activeData = getSystemData();
    if (activeData.settings.maintenanceMode) {
      navigate('/maintenance');
      return;
    }
    setUser(activeSession);
  }, [navigate]);

  // Sync state
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

  const internObj = systemData.interns.find(i => i.id === user?.id) || {};
  const projectObj = systemData.projects.find(p => p.id === internObj.projectId) || null;
  const mentorObj = systemData.mentors.find(m => m.id === internObj.mentorId) || null;

  // Filter tasks assigned to current intern
  const myTasks = systemData.tasks.filter(t => t.assignedInternId === user?.id);
  const mySubmissions = systemData.submissions.filter(s => s.internId === user?.id);
  const myMeetings = systemData.meetings.filter(m => m.participants.includes(user?.id));
  const myFeedback = systemData.feedback.filter(f => f.internId === user?.id).sort((a,b) => new Date(b.date) - new Date(a.date));
  const myCertificates = systemData.certificates.filter(c => c.internId === user?.id);

  // Scoped Vault Files
  const allowedVaultItems = systemData.vault.filter(item => {
    // Admin only files hidden
    if (item.allowedRoles.includes('intern')) return true;
    return false;
  });

  // Calculate Attendance counts
  const attendanceRecords = systemData.attendance.filter(a => a.internId === user?.id);
  const attendanceCounts = {
    present: attendanceRecords.filter(a => a.status === 'present').length,
    absent: attendanceRecords.filter(a => a.status === 'absent').length,
    late: attendanceRecords.filter(a => a.status === 'late').length,
    leave: attendanceRecords.filter(a => a.status === 'leave').length
  };

  // Performance Matrix score
  const performanceScore = (() => {
    const attWeight = (internObj.attendanceScore || 0) * 0.35;
    const taskWeight = (internObj.taskProgress || 0) * 0.40;
    const trainWeight = (internObj.trainingProgress || 0) * 0.25;
    return Math.round(attWeight + taskWeight + trainWeight);
  })();

  // Badges logic
  const badgeEarned = (() => {
    if (performanceScore >= 90) return 'Code Ninja';
    if (performanceScore >= 80) return 'Star Deliverer';
    if (performanceScore >= 70) return 'Elite Associate';
    return null;
  })();

  // Submit Task Action
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!submitRepo.trim()) {
      alert('Please fill out the repository pull request link.');
      return;
    }

    const data = getSystemData();
    
    // Create submission record
    const newSub = {
      id: `sub-${Date.now()}`,
      taskId: submittingTaskId,
      internId: user.id,
      submittedDate: new Date().toISOString().split('T')[0],
      repositoryLink: submitRepo.trim(),
      comments: submitComments.trim(),
      status: 'pending',
      feedback: ''
    };

    data.submissions.unshift(newSub);

    // Update task status to submitted
    data.tasks = data.tasks.map(t => {
      if (t.id === submittingTaskId) {
        return { ...t, status: 'submitted', repositoryLink: submitRepo.trim() };
      }
      return t;
    });

    updateSystemData(data);
    logAudit('TASK_SUBMITTED', user.name, user.id, `Task submission: ${data.tasks.find(t => t.id === submittingTaskId)?.title}`);
    
    // Notify mentor
    if (internObj.mentorId) {
      const mentorNotif = {
        id: `notif-${Date.now()}`,
        userId: internObj.mentorId,
        text: `Intern ${user.name} submitted task for review.`,
        read: false,
        timestamp: new Date().toISOString()
      };
      data.notifications.unshift(mentorNotif);
      updateSystemData(data);
    }

    setSubmittingTaskId('');
    setSubmitRepo('');
    setSubmitComments('');
    alert('Task submitted successfully for mentor review.');
  };

  // Download log vault file
  const handleDownloadFile = (file) => {
    logAudit(
      'VAULT_FILE_DOWNLOADED',
      user.name,
      user.id,
      `File: ${file.name}`,
      { size: file.size, parentId: file.parentId }
    );
  };

  // Sidebar Items for Intern layout
  const sidebarItems = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'My Profile', icon: Users },
    { name: 'My Project', icon: FolderGit2 },
    { name: 'Tasks', icon: ClipboardList },
    { name: 'Submissions', icon: FileText },
    { name: 'Attendance', icon: Calendar },
    { name: 'Training', icon: BookOpen },
    { name: 'Feedback', icon: Award },
    { name: 'Vault', icon: KeyRound },
    { name: 'Meetings', icon: Calendar },
    { name: 'Chat', icon: MessageCircle },
    { name: 'Performance', icon: BarChart3 },
    { name: 'Certificates', icon: Award }
  ];

  return (
    <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} menuItems={sidebarItems}>
      
      {/* 1. TABS CONTENT: HOME DASHBOARD */}
      {activeTab === 'Dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Grid summary banner */}
          <div className="dash-grid-stats">
            <div className="dash-card">
              <span className="kpi-label">Internship Progress</span>
              <ProgressBar progress={performanceScore} label={null} />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Weighted overall rating</div>
            </div>

            <div className="dash-card">
              <span className="kpi-label">Current Project</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', marginTop: '0.25rem' }}>
                {projectObj ? projectObj.name : 'Unallocated'}
              </div>
            </div>

            <div className="dash-card">
              <span className="kpi-label">Assigned Tasks completed</span>
              <div className="kpi-value">
                {myTasks.filter(t => t.status === 'completed').length} / {myTasks.length}
              </div>
            </div>

            <div className="dash-card">
              <span className="kpi-label">Attendance Score</span>
              <div className="kpi-value">{internObj.attendanceScore || 100}%</div>
            </div>

            <div className="dash-card">
              <span className="kpi-label">Assigned Mentor</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem' }}>
                {mentorObj ? mentorObj.name : 'Not assigned'}
              </div>
            </div>
          </div>

          {/* Project Details quick summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            <div className="dash-card">
              <span style={{ fontWeight: 700 }}>Active Project Core Spec</span>
              {projectObj ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div><strong>Description:</strong> {projectObj.description}</div>
                  <div><strong>Problem Statement:</strong> {projectObj.problemStatement}</div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Target Start: {projectObj.startDate}</span>
                    <span>Target End: {projectObj.endDate}</span>
                  </div>
                </div>
              ) : (
                <div className="empty-state">No projects allocated yet.</div>
              )}
            </div>

            <div className="dash-card">
              <span style={{ fontWeight: 700 }}>Upcoming Task Deadlines</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myTasks.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
                  <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 600 }}>{task.title}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--error)' }}>Due: {task.deadline}</span>
                  </div>
                ))}
                {myTasks.filter(t => t.status !== 'completed').length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No pending tasks allocated. Good job!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TABS CONTENT: PROFILE */}
      {activeTab === 'My Profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
          <span style={{ fontWeight: 700 }}>Personal Information Profile</span>
          <div className="dash-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-primary)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Full Name:</span>
                <span style={{ fontWeight: 700 }}>{user?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-primary)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Email Address:</span>
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-primary)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Phone:</span>
                <span>{user?.phone || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-primary)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Department:</span>
                <span>{user?.department || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-primary)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cohort Batch:</span>
                <span>{user?.batch || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Joined Date:</span>
                <span>{user?.joined || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TABS CONTENT: MY PROJECT */}
      {activeTab === 'My Project' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '750px' }}>
          <span style={{ fontWeight: 700 }}>Allocated Development Project Specification</span>
          {projectObj ? (
            <div className="dash-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{projectObj.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{projectObj.description}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div>
                  <span style={{ fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Problem Statement</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{projectObj.problemStatement}</p>
                </div>

                <div>
                  <span style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Milestone Checklist</span>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                    {projectObj.milestones.map((mile, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', border: '1.5px solid var(--border-color)', borderRadius: '4px' }}>
                          {i === 0 && <Check size={12} color="var(--success)" />}
                        </div>
                        <span style={{ color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: i === 0 ? 'line-through' : 'none' }}>
                          {mile}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">No projects allocated.</div>
          )}
        </div>
      )}

      {/* 4. TABS CONTENT: TASKS */}
      {activeTab === 'Tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Assigned Workspace Tasks Checklist</span>

          <StudentTable
            columns={[
              { key: 'title', title: 'Task Title' },
              { key: 'priority', title: 'Priority', render: (val) => <span style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.75rem', color: val === 'high' ? 'var(--error)' : 'var(--text-secondary)' }}>{val}</span> },
              { key: 'deadline', title: 'Deadline' },
              { key: 'status', title: 'Status', render: (val) => <span className={`status-badge ${val}`}>{val}</span> }
            ]}
            data={myTasks}
            searchField="title"
            actions={(row) => (
              row.status !== 'completed' && row.status !== 'submitted' ? (
                <button className="dash-btn dash-btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setSubmittingTaskId(row.id)}>
                  Submit Task
                </button>
              ) : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Under review</span>
            )}
          />
        </div>
      )}

      {/* 5. TABS CONTENT: SUBMISSIONS GATEWAY */}
      {activeTab === 'Submissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Deliverable Submissions Logs</span>
          <StudentTable
            columns={[
              { key: 'taskId', title: 'Task Reference', render: (val) => systemData.tasks.find(t => t.id === val)?.title || 'N/A' },
              { key: 'submittedDate', title: 'Submitted Date' },
              { key: 'repositoryLink', title: 'PR Link', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Open PR</a> : 'N/A' },
              { key: 'comments', title: 'Submitted Comment' },
              { key: 'status', title: 'Review Status', render: (val) => <span className={`status-badge ${val}`}>{val}</span> },
              { key: 'feedback', title: 'Mentor Feedback', render: (val) => val || 'No feedback yet' }
            ]}
            data={mySubmissions}
            searchField="submittedDate"
          />
        </div>
      )}

      {/* 6. TABS CONTENT: ATTENDANCE HISTORY */}
      {activeTab === 'Attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Attendance Metrics Tracking</span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            <div className="dash-card">
              <span className="kpi-label">Present</span>
              <div className="kpi-value" style={{ color: 'var(--success)' }}>{attendanceCounts.present}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Late</span>
              <div className="kpi-value" style={{ color: 'var(--warning)' }}>{attendanceCounts.late}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Leave</span>
              <div className="kpi-value" style={{ color: 'var(--text-secondary)' }}>{attendanceCounts.leave}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Absent</span>
              <div className="kpi-value" style={{ color: 'var(--error)' }}>{attendanceCounts.absent}</div>
            </div>
          </div>

          <div className="dash-card">
            <span style={{ fontWeight: 700 }}>Attendance Logs Calendar</span>
            <StudentTable
              columns={[
                { key: 'date', title: 'Date Record' },
                { key: 'status', title: 'Status', render: (val) => <span className={`status-badge ${val}`}>{val}</span> }
              ]}
              data={attendanceRecords.sort((a,b) => new Date(b.date) - new Date(a.date))}
              searchField="date"
            />
          </div>
        </div>
      )}

      {/* 7. TABS CONTENT: TRAINING CURRICULUM PROGRESS */}
      {activeTab === 'Training' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
          <span style={{ fontWeight: 700 }}>Internship Training Curriculum Module</span>
          
          <div className="dash-card">
            <ProgressBar progress={100} label="Module 1: HTML5 & CSS3 Editorial Frameworks" color="#B8923D" />
            <ProgressBar progress={90} label="Module 2: Version Control (Git & GitHub)" color="#B8923D" />
            <ProgressBar progress={70} label="Module 3: React Router DOM & Layout Guards" color="#B8923D" />
            <ProgressBar progress={internObj.trainingProgress || 40} label="Module 4: Enterprise Project Handover" color="#B8923D" />
          </div>
        </div>
      )}

      {/* 8. TABS CONTENT: FEEDBACK FEED */}
      {activeTab === 'Feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '650px' }}>
          <span style={{ fontWeight: 700 }}>Faculty Feedback Stream Logs</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myFeedback.map(f => (
              <div key={f.id} className="dash-card" style={{ borderLeft: f.priority === 'high' ? '4px solid var(--error)' : '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  <span>From: {f.mentorName}</span>
                  <span>{f.date}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                  "{f.text}"
                </p>
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <span className={`status-badge ${f.priority === 'high' ? 'overdue' : f.priority === 'medium' ? 'pending' : 'leave'}`}>
                    Priority {f.priority}
                  </span>
                </div>
              </div>
            ))}
            {myFeedback.length === 0 && (
              <div className="empty-state">No feedback streams posted yet.</div>
            )}
          </div>
        </div>
      )}

      {/* 9. TABS CONTENT: VAULT BROWSER */}
      {activeTab === 'Vault' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Corporate Document Vault Scopes</span>
          
          <div className="vault-grid">
            {allowedVaultItems.map(item => (
              <div key={item.id} className="vault-item">
                <div style={{ fontSize: '1.5rem' }}>
                  {item.type === 'folder' ? '📁' : '📄'}
                </div>
                <div className="vault-item-name">{item.name}</div>
                <div className="vault-item-size">{item.size || 'Folder'}</div>
                
                {item.type === 'file' && (
                  <a 
                    href={item.url} 
                    onClick={() => handleDownloadFile(item)}
                    className="dash-btn dash-btn-secondary" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', width: '100%' }}
                  >
                    <Download size={12} /> Download
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. TABS CONTENT: MEETINGS */}
      {activeTab === 'Meetings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '650px' }}>
          <span style={{ fontWeight: 700 }}>Assigned Sync Meetings</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myMeetings.map(meet => (
              <div key={meet.id} className="dash-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{meet.title}</h4>
                  <span className="status-badge pending" style={{ fontSize: '0.7rem' }}>Upcoming</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>{meet.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--bg-primary)', paddingTop: '0.75rem' }}>
                  <span>Date: {meet.date} • {meet.time}</span>
                  <a href={meet.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ExternalLink size={12} /> Join Session
                  </a>
                </div>
              </div>
            ))}
            {myMeetings.length === 0 && (
              <div className="empty-state">No scheduled sync sessions found.</div>
            )}
          </div>
        </div>
      )}

      {/* 11. TABS CONTENT: CHAT CENTER */}
      {activeTab === 'Chat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Messaging Room</span>
          <ChatBox currentUser={user} />
        </div>
      )}

      {/* 12. TABS CONTENT: PERFORMANCE MATRIX */}
      {activeTab === 'Performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '650px' }}>
          <span style={{ fontWeight: 700 }}>Associate Performance Matrix Indicators</span>

          <div className="dash-card">
            <span style={{ fontWeight: 700 }}>Overall Quality Score</span>
            <div className="kpi-value" style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{performanceScore}</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Attendance Rating Weight (35%):</span>
                <strong>{Math.round(internObj.attendanceScore * 0.35)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Task Completed Weight (40%):</span>
                <strong>{Math.round(internObj.taskProgress * 0.40)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Training Progress Weight (25%):</span>
                <strong>{Math.round(internObj.trainingProgress * 0.25)}</strong>
              </div>
            </div>

            {badgeEarned && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <span style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>System Awarded Badges</span>
                <div className="badge-container">
                  <span className={`intern-badge ${badgeEarned.toLowerCase().replace(' ', '-')}`}>
                    {badgeEarned}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 13. TABS CONTENT: CERTIFICATES ISSUED */}
      {activeTab === 'Certificates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '650px' }}>
          <span style={{ fontWeight: 700 }}>Issued Completion Credentials</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {myCertificates.map(cert => (
              <div key={cert.id} className="dash-card" style={{ borderColor: 'var(--success)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700 }}>{cert.title} Completion Certificate</div>
                  <span className="status-badge approved">VERIFIED</span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0.5rem 0' }}>
                  <div><strong>Credential ID:</strong> {cert.id}</div>
                  <div><strong>Hash:</strong> <code style={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>{cert.hash}</code></div>
                  <div><strong>Date Issued:</strong> {cert.issueDate}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="dash-btn dash-btn-primary" onClick={() => setViewingCertificate(cert)}>
                    <Eye size={14} /> View Certificate
                  </button>
                  <button 
                    className="dash-btn dash-btn-secondary" 
                    onClick={() => {
                      const url = `${window.location.origin}/verify/${cert.token}`;
                      navigator.clipboard.writeText(url);
                      alert('Verification URL copied to clipboard!');
                    }}
                  >
                    Copy verify link
                  </button>
                </div>
              </div>
            ))}
            {myCertificates.length === 0 && (
              <div className="empty-state">No certificates issued yet. Certificates are unlocked upon exit evaluation recommendations.</div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          MODALS & FORM DRAWERS PANELS
          ========================================== */}

      {/* Task Submission Modal Gateway */}
      {submittingTaskId && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Submit Task Deliverables</h3>
              <button className="modal-close-btn" onClick={() => setSubmittingTaskId('')}><X size={20} /></button>
            </div>
            <form onSubmit={handleTaskSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Repository GitHub Pull Request / Deliverable Link *</label>
                  <input
                    type="url"
                    className="dash-input"
                    placeholder="https://github.com/steigel/..."
                    value={submitRepo}
                    onChange={e => setSubmitRepo(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Comments / Documentation Note</label>
                  <textarea
                    className="dash-textarea"
                    rows={3}
                    placeholder="Describe any deployment checks, test coverage metrics, etc..."
                    value={submitComments}
                    onChange={e => setSubmitComments(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="dash-btn dash-btn-secondary" onClick={() => setSubmittingTaskId('')}>Cancel</button>
                <button type="submit" className="dash-btn dash-btn-primary">Submit for Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {viewingCertificate && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Verifiable Credential</h3>
              <button className="modal-close-btn" onClick={() => setViewingCertificate(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ color: 'var(--success)' }}>
                <Award size={48} />
              </div>
              
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Steigel Innovations Hub</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Certificate of Completion</div>
              </div>

              <div style={{ margin: '1.5rem 0' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>This is to certify that</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0' }}>{viewingCertificate.internName}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto' }}>
                  has successfully completed the developmental internship program in <strong>{viewingCertificate.title}</strong> duration of {viewingCertificate.startDate} to {viewingCertificate.endDate}.
                </p>
              </div>

              <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Certificate ID: {viewingCertificate.id}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Issued on: {viewingCertificate.issueDate}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  Hash: {viewingCertificate.hash.substring(0, 16)}...
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="dash-btn dash-btn-primary" onClick={() => setViewingCertificate(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default InternDashboard;
