import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, FolderGit2, FileText, ClipboardList, Video,
  Calendar, Award, MessageCircle, BarChart3, Plus
} from 'lucide-react';
import { getSystemData, updateSystemData, getSession, logAudit, pushNotification } from '../lib/systemStore';
import DashboardLayout from '../components/DashboardLayout';
import StudentTable from '../components/StudentTable';
import ChatBox from '../components/ChatBox';
import ProgressBar from '../components/ProgressBar';
import AssignTask from '../components/AssignTask';
import { RadarChart } from '../components/Charts';
import '../components/auth.css';

export const MentorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [systemData, setSystemData] = useState(getSystemData());
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Sidebar task push state
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // Active Selected Intern for profile/radar evaluation
  const [selectedInternId, setSelectedInternId] = useState('');

  // Score grid editing inputs
  const [editingScores, setEditingScores] = useState({ internId: '', tech: 0, att: 0, assign: 0 });

  // Live classroom state inputs
  const [meetTitle, setMeetTitle] = useState('');
  const [meetUrl, setMeetUrl] = useState('');

  // Direct feedback state inputs
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackPriority, setFeedbackPriority] = useState('medium');

  // Meetings schedule state inputs
  const [meetDate, setMeetDate] = useState('');
  const [meetTime, setMeetTime] = useState('');
  const [meetDesc, setMeetDesc] = useState('');
  const [meetParticipants, setMeetParticipants] = useState([]);

  // Final exit evaluations
  const [evalTech, setEvalTech] = useState(80);
  const [evalComm, setEvalComm] = useState(80);
  const [evalAtt, setEvalAtt] = useState(80);
  const [evalTask, setEvalTask] = useState(80);
  const [evalSolve, setEvalSolve] = useState(80);
  const [evalTeam, setEvalTeam] = useState(80);
  const [evalComment, setEvalComment] = useState('');
  const [evalRec, setEvalRec] = useState('Complete Internship');

  // Security checks
  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession) {
      navigate('/mentor-login');
      return;
    }
    if (activeSession.role !== 'mentor') {
      navigate(activeSession.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
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

  // Sync data updates
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

  // Filter interns assigned to this mentor
  const myInterns = systemData.interns.filter(i => i.mentorId === user?.id);
  const myInternIds = myInterns.map(i => i.id);

  // Set default selected intern for radar
  useEffect(() => {
    if (myInterns.length > 0 && !selectedInternId) {
      setSelectedInternId(myInterns[0].id);
    }
  }, [myInterns, selectedInternId]);

  // KPI Calculations
  const assignedCount = myInterns.length;
  
  const activeProjCount = systemData.projects.filter(p => 
    p.mentorId === user?.id && p.status === 'active'
  ).length;

  const mySubmissions = systemData.submissions.filter(sub => 
    myInternIds.includes(sub.internId)
  );
  const pendingReviewsCount = mySubmissions.filter(s => s.status === 'pending').length;

  const myTasks = systemData.tasks.filter(t => myInternIds.includes(t.assignedInternId));
  const overdueCount = myTasks.filter(t => {
    const isPast = new Date(t.deadline) < new Date();
    return isPast && t.status !== 'completed';
  }).length;

  const avgPerformance = (() => {
    if (myInterns.length === 0) return 0;
    const total = myInterns.reduce((acc, curr) => {
      const score = (curr.attendanceScore * 0.35) + (curr.taskProgress * 0.40) + (curr.trainingProgress * 0.25);
      return acc + score;
    }, 0);
    return Math.round(total / myInterns.length);
  })();

  // Gradebook / Score Grid Action
  const startEditScores = (intern) => {
    // Find current scoring evaluations if exists
    const current = systemData.evaluations.find(e => e.internId === intern.id) || { tech: 80, att: 80, assign: 80 };
    setEditingScores({
      internId: intern.id,
      tech: current.tech || 80,
      att: current.att || 80,
      assign: current.assign || 80
    });
  };

  const handleSaveScores = () => {
    const data = getSystemData();
    const index = data.evaluations.findIndex(e => e.internId === editingScores.internId);
    const overall = Math.round((Number(editingScores.tech) + Number(editingScores.att) + Number(editingScores.assign)) / 3);

    const scoreObj = {
      internId: editingScores.internId,
      tech: Number(editingScores.tech),
      att: Number(editingScores.att),
      assign: Number(editingScores.assign),
      overall
    };

    if (index !== -1) {
      data.evaluations[index] = { ...data.evaluations[index], ...scoreObj };
    } else {
      data.evaluations.push({
        id: `eval-${Date.now()}`,
        mentorId: user.id,
        ...scoreObj
      });
    }

    // Update intern profile task weights as simulated sync
    data.interns = data.interns.map(i => {
      if (i.id === editingScores.internId) {
        return { ...i, attendanceScore: Number(editingScores.att) };
      }
      return i;
    });

    updateSystemData(data);
    const name = data.interns.find(i => i.id === editingScores.internId)?.name || 'Intern';
    logAudit('SCORES_UPDATED', user.name, user.id, `Scores graded for ${name}`);
    pushNotification(editingScores.internId, `Mentor updated your gradebook ratings.`);
    setEditingScores({ internId: '', tech: 0, att: 0, assign: 0 });
  };

  // Submission Reviews
  const handleSubmissionReview = (subId, reviewStatus, feedback) => {
    const data = getSystemData();
    const subIndex = data.submissions.findIndex(s => s.id === subId);
    if (subIndex === -1) return;

    const sub = data.submissions[subIndex];
    data.submissions[subIndex].status = reviewStatus;
    data.submissions[subIndex].feedback = feedback;

    // Synchronize task statuses
    data.tasks = data.tasks.map(t => {
      if (t.id === sub.taskId) {
        return { ...t, status: reviewStatus === 'approved' ? 'completed' : 'pending' };
      }
      return t;
    });

    // Update intern progress metrics
    if (reviewStatus === 'approved') {
      data.interns = data.interns.map(i => {
        if (i.id === sub.internId) {
          const finished = data.tasks.filter(t => t.assignedInternId === i.id && t.status === 'completed').length + 1;
          const total = data.tasks.filter(t => t.assignedInternId === i.id).length;
          const pct = total > 0 ? Math.round((finished / total) * 100) : 0;
          return { ...i, taskProgress: pct };
        }
        return i;
      });
    }

    updateSystemData(data);
    const internName = data.interns.find(i => i.id === sub.internId)?.name || 'Intern';
    logAudit('SUBMISSION_REVIEWED', user.name, user.id, `Submission reviewed for ${internName}`, { status: reviewStatus });
    pushNotification(sub.internId, `Your task submission was reviewed: ${reviewStatus.toUpperCase()}. Feedback: ${feedback}`);
  };

  // Classroom broadcaster trigger
  const handleToggleLiveSession = (active) => {
    if (active && (!meetTitle.trim() || !meetUrl.trim())) {
      alert('Please fill out both the Zoom/Meet URL and the session title.');
      return;
    }

    const data = getSystemData();
    data.settings.liveClassroom = {
      title: active ? meetTitle : '',
      url: active ? meetUrl : '',
      active
    };

    updateSystemData(data);
    logAudit(active ? 'LIVE_CLASSROOM_STARTED' : 'LIVE_CLASSROOM_ENDED', user.name, user.id, active ? meetTitle : 'Classroom Session');

    if (active) {
      // Notify all my interns
      myInternIds.forEach(id => {
        pushNotification(id, `🔴 LIVE CLASSROOM started by ${user.name}: "${meetTitle}"`);
      });
    } else {
      setMeetTitle('');
      setMeetUrl('');
    }
  };

  // Post feedback stream
  const handlePostFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !selectedInternId) return;

    const data = getSystemData();
    const newFeedback = {
      id: `f-${Date.now()}`,
      internId: selectedInternId,
      mentorId: user.id,
      mentorName: user.name,
      text: feedbackText.trim(),
      date: new Date().toISOString().split('T')[0],
      priority: feedbackPriority
    };

    data.feedback.push(newFeedback);
    updateSystemData(data);

    logAudit('FEEDBACK_POSTED', user.name, user.id, `Feedback posted to ${data.interns.find(i => i.id === selectedInternId)?.name}`);
    pushNotification(selectedInternId, `Mentor left feedback: "${feedbackText.trim().substring(0, 30)}..."`);
    setFeedbackText('');
  };

  // Meetings schedulers
  const handleCreateMeeting = (e) => {
    e.preventDefault();
    if (!meetDate || !meetTime || meetParticipants.length === 0) {
      alert('Please select date, time, and at least one participant.');
      return;
    }

    const data = getSystemData();
    const newMeeting = {
      id: `meet-${Date.now()}`,
      title: meetDesc || 'Academic Sync Session',
      date: meetDate,
      time: meetTime,
      description: meetDesc,
      url: 'https://meet.google.com/steigel-sync-room',
      participants: meetParticipants,
      mentorId: user.id
    };

    data.meetings.push(newMeeting);
    updateSystemData(data);

    logAudit('MEETING_SCHEDULED', user.name, user.id, newMeeting.title);
    meetParticipants.forEach(id => {
      pushNotification(id, `New meeting scheduled on ${meetDate} at ${meetTime}: "${newMeeting.title}"`);
    });

    setMeetDate(''); setMeetTime(''); setMeetDesc(''); setMeetParticipants([]);
  };

  // Submit exit recommendation evaluation
  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    if (!selectedInternId) return;

    const data = getSystemData();
    const newFinalEval = {
      id: `final-eval-${Date.now()}`,
      internId: selectedInternId,
      mentorId: user.id,
      ratings: {
        tech: Number(evalTech),
        comm: Number(evalComm),
        att: Number(evalAtt),
        task: Number(evalTask),
        solve: Number(evalSolve),
        team: Number(evalTeam)
      },
      comments: evalComment,
      recommendation: evalRec,
      timestamp: new Date().toISOString()
    };

    data.evaluations.push(newFinalEval);
    
    // Auto flag candidate for certification if positive exit recommendation
    if (evalRec === 'Complete Internship') {
      data.interns = data.interns.map(i => i.id === selectedInternId ? { ...i, certificateStatus: 'eligible', statusNotes: evalComment } : i);
    } else {
      data.interns = data.interns.map(i => i.id === selectedInternId ? { ...i, statusNotes: evalComment } : i);
    }

    updateSystemData(data);
    const internName = data.interns.find(i => i.id === selectedInternId)?.name || 'Intern';
    logAudit('SUBMISSION_REVIEWED', user.name, user.id, `Exit Evaluation for ${internName}`);
    alert(`Exit evaluation saved. ${internName} is flagged as: ${evalRec}`);
    setEvalComment('');
  };

  // Chart data calculations
  const selectedInternObj = myInterns.find(i => i.id === selectedInternId);
  const radarData = (() => {
    if (!selectedInternObj) return null;
    
    const internEval = systemData.evaluations.find(e => e.internId === selectedInternId) || { tech: 80, att: 80, assign: 80 };
    const taskPct = selectedInternObj.taskProgress || 0;
    const trainingPct = selectedInternObj.trainingProgress || 0;

    // Calculate averages of batch
    const allInternsInBatch = systemData.interns.filter(i => i.batch === selectedInternObj.batch);
    const batchTech = 80; // Default mockup batch averages
    const batchAtt = Math.round(allInternsInBatch.reduce((acc, curr) => acc + (curr.attendanceScore || 0), 0) / (allInternsInBatch.length || 1));
    const batchTask = Math.round(allInternsInBatch.reduce((acc, curr) => acc + (curr.taskProgress || 0), 0) / (allInternsInBatch.length || 1));
    const batchTrain = Math.round(allInternsInBatch.reduce((acc, curr) => acc + (curr.trainingProgress || 0), 0) / (allInternsInBatch.length || 1));

    return {
      labels: ['Technical Skill', 'Attendance', 'Assignment Quality', 'Task Completion', 'Training Progress'],
      datasets: [
        {
          label: selectedInternObj.name,
          data: [
            internEval.tech || 80,
            selectedInternObj.attendanceScore || 80,
            internEval.assign || 80,
            taskPct,
            trainingPct
          ],
          backgroundColor: 'rgba(184, 146, 61, 0.15)',
          borderColor: '#B8923D',
          borderWidth: 2
        },
        {
          label: 'Batch Average',
          data: [batchTech, batchAtt, 80, batchTask, batchTrain],
          backgroundColor: 'rgba(160, 168, 177, 0.1)',
          borderColor: '#A0A8B1',
          borderWidth: 1,
          borderDash: [5, 5]
        }
      ]
    };
  })();

  const sidebarItems = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'My Interns', icon: Users },
    { name: 'Projects', icon: FolderGit2 },
    { name: 'Tasks', icon: ClipboardList },
    { name: 'Submissions', icon: FileText },
    { name: 'Attendance', icon: Calendar },
    { name: 'Live Classroom', icon: Video },
    { name: 'Feedback', icon: Award },
    { name: 'Meetings', icon: Calendar },
    { name: 'Chat', icon: MessageCircle },
    { name: 'Evaluations', icon: ClipboardList }
  ];

  return (
    <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} menuItems={sidebarItems}>
      
      {/* 1. TABS CONTENT: HOME DASHBOARD */}
      {activeTab === 'Dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Stats Bar */}
          <div className="dash-grid-stats">
            <div className="dash-card">
              <span className="kpi-label">Assigned Interns</span>
              <div className="kpi-value">{assignedCount}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Active Projects</span>
              <div className="kpi-value">{activeProjCount}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Pending Reviews</span>
              <div className="kpi-value">{pendingReviewsCount}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Overdue Tasks</span>
              <div className="kpi-value">{overdueCount}</div>
            </div>
            <div className="dash-card">
              <span className="kpi-label">Cohort Quality</span>
              <div className="kpi-value">{avgPerformance}%</div>
            </div>
          </div>

          {/* Intern performances */}
          <div className="dash-card">
            <span style={{ fontWeight: 700 }}>Intern Performance Overview</span>
            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Associate Name</th>
                    <th>Cohort Batch</th>
                    <th>Project Name</th>
                    <th>Attendance Score</th>
                    <th>Task progress</th>
                    <th>Training Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myInterns.map(i => {
                    const p = systemData.projects.find(proj => proj.id === i.projectId);
                    return (
                      <tr key={i.id}>
                        <td style={{ fontWeight: 700 }}>{i.name}</td>
                        <td>{i.batch}</td>
                        <td>{p ? p.name : 'Not allocated'}</td>
                        <td>{i.attendanceScore}%</td>
                        <td><ProgressBar progress={i.taskProgress} label={null} /></td>
                        <td><ProgressBar progress={i.trainingProgress} label={null} color="#B8923D" /></td>
                        <td>
                          <button
                            onClick={() => setActiveTab('Messaging Room')}
                            className="dash-btn dash-btn-primary"
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <MessageCircle size={13} /> Chat
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {myInterns.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No interns assigned to you.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. TABS CONTENT: MY INTERNS GRADEBOOK */}
      {activeTab === 'My Interns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Intern scoring grid & performance radar</span>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {/* Gradebook Card */}
            <div className="dash-card" style={{ flexGrow: 2 }}>
              <span style={{ fontWeight: 700 }}>Academic Gradebook Ratings</span>
              
              <div className="table-responsive">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Intern Name</th>
                      <th>Technical Skill</th>
                      <th>Attendance Quality</th>
                      <th>Assignment Quality</th>
                      <th>Overall Score</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myInterns.map(i => {
                      const evalObj = systemData.evaluations.find(e => e.internId === i.id) || { tech: 80, att: 80, assign: 80, overall: 80 };
                      const isEditing = editingScores.internId === i.id;

                      return (
                        <tr key={i.id} onClick={() => setSelectedInternId(i.id)} style={{ cursor: 'pointer', backgroundColor: selectedInternId === i.id ? 'var(--hover-bg)' : 'transparent' }}>
                          <td>{i.name}</td>
                          <td>
                            {isEditing ? (
                              <input type="number" className="dash-input" style={{ width: '70px', padding: '0.2rem' }} value={editingScores.tech} onChange={e => setEditingScores({ ...editingScores, tech: e.target.value })} />
                            ) : evalObj.tech}
                          </td>
                          <td>
                            {isEditing ? (
                              <input type="number" className="dash-input" style={{ width: '70px', padding: '0.2rem' }} value={editingScores.att} onChange={e => setEditingScores({ ...editingScores, att: e.target.value })} />
                            ) : evalObj.att}
                          </td>
                          <td>
                            {isEditing ? (
                              <input type="number" className="dash-input" style={{ width: '70px', padding: '0.2rem' }} value={editingScores.assign} onChange={e => setEditingScores({ ...editingScores, assign: e.target.value })} />
                            ) : evalObj.assign}
                          </td>
                          <td style={{ fontWeight: 700 }}>
                            {isEditing ? (
                              <span style={{ color: 'var(--text-muted)' }}>Auto</span>
                            ) : evalObj.overall}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {isEditing ? (
                              <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                <button className="dash-btn dash-btn-primary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem' }} onClick={handleSaveScores}>
                                  Save
                                </button>
                                <button className="dash-btn dash-btn-secondary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem' }} onClick={() => setEditingScores({ internId: '', tech: 0, att: 0, assign: 0 })}>
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button className="dash-btn dash-btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }} onClick={() => startEditScores(i)}>
                                Grade
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

            {/* Performance radar card */}
            <div className="dash-card">
              <span style={{ fontWeight: 700 }}>Radar Performance Profile</span>
              {selectedInternObj ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedInternObj.name} Progress Map</div>
                  {radarData && <RadarChart data={radarData} />}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dashed line represents Cohort Batch average standards.</span>
                </div>
              ) : (
                <div className="empty-state">No intern selected.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. TABS CONTENT: PROJECTS */}
      {activeTab === 'Projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Supervised Development Projects</span>
          <StudentTable
            columns={[
              { key: 'name', title: 'Project Name' },
              { key: 'department', title: 'Department' },
              { key: 'startDate', title: 'Start Date' },
              { key: 'endDate', title: 'Target End Date' },
              { key: 'status', title: 'Status', render: (val) => <span className={`status-badge ${val}`}>{val}</span> }
            ]}
            data={systemData.projects.filter(p => p.mentorId === user?.id)}
            searchField="name"
          />
        </div>
      )}

      {/* 4. TABS CONTENT: TASKS */}
      {activeTab === 'Tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>Task Push Dispatcher</span>
            <button className="dash-btn dash-btn-primary" onClick={() => setTaskModalOpen(true)}>
              <Plus size={16} /> Push New Task
            </button>
          </div>

          <StudentTable
            columns={[
              { key: 'title', title: 'Task Title' },
              { key: 'assignedInternId', title: 'Intern', render: (val) => systemData.interns.find(i => i.id === val)?.name || 'N/A' },
              { key: 'priority', title: 'Priority', render: (val) => <span style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: val === 'high' ? 'var(--error)' : 'var(--text-muted)' }}>{val}</span> },
              { key: 'deadline', title: 'Deadline' },
              { key: 'status', title: 'Status', render: (val) => <span className={`status-badge ${val}`}>{val}</span> }
            ]}
            data={systemData.tasks.filter(t => t.mentorId === user?.id)}
            searchField="title"
          />
        </div>
      )}

      {/* 5. TABS CONTENT: SUBMISSIONS */}
      {activeTab === 'Submissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Task Submissions Review Gateway</span>
          
          <StudentTable
            columns={[
              { key: 'internId', title: 'Associate Intern', render: (val) => systemData.interns.find(i => i.id === val)?.name || 'N/A' },
              { key: 'taskId', title: 'Task Reference', render: (val) => systemData.tasks.find(t => t.id === val)?.title || 'N/A' },
              { key: 'submittedDate', title: 'Submitted Date' },
              { key: 'repositoryLink', title: 'Repository PR', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>Open Link</a> : 'Upload File' },
              { key: 'comments', title: 'Intern comments' },
              { key: 'status', title: 'Status', render: (val) => <span className={`status-badge ${val}`}>{val}</span> }
            ]}
            data={mySubmissions}
            searchField="submittedDate"
            actions={(row) => (
              row.status === 'pending' ? (
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className="dash-btn dash-btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', backgroundColor: 'var(--success)' }} onClick={() => handleSubmissionReview(row.id, 'approved', 'Submission verified and approved by Mentor.')}>
                    Approve
                  </button>
                  <button className="dash-btn dash-btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => {
                    const comment = prompt('Provide feedback for change requests:');
                    if (comment) {
                      handleSubmissionReview(row.id, 'rejected', comment);
                    }
                  }}>
                    Request Changes
                  </button>
                </div>
              ) : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reviewed</span>
            )}
          />
        </div>
      )}

      {/* 6. TABS CONTENT: ATTENDANCE */}
      {activeTab === 'Attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Cohort Daily Attendance Records</span>
          
          <StudentTable
            columns={[
              { key: 'name', title: 'Intern Name' },
              { key: 'batch', title: 'Cohort Batch' },
              { key: 'attendanceScore', title: 'Attendance Rating Score', render: (val) => `${val}%` }
            ]}
            data={myInterns}
            searchField="name"
          />
        </div>
      )}

      {/* 7. TABS CONTENT: LIVE CLASSROOM */}
      {activeTab === 'Live Classroom' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
          <span style={{ fontWeight: 700 }}>Live Classroom Broadcaster</span>

          <div className="dash-card" style={{ borderColor: systemData.settings.liveClassroom?.active ? '#EF4444' : 'var(--border-color)' }}>
            <div className="dash-card-header">
              <span className="dash-card-title">Live Broadcast Session Setup</span>
              <span className={`status-badge ${systemData.settings.liveClassroom?.active ? 'inactive' : 'leave'}`}>
                {systemData.settings.liveClassroom?.active ? '🔴 Broadcast Live' : 'Offline'}
              </span>
            </div>

            {systemData.settings.liveClassroom?.active ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.9rem' }}>
                  <strong>Session:</strong> {systemData.settings.liveClassroom.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>Meet URL:</strong> <a href={systemData.settings.liveClassroom.url} target="_blank" rel="noopener noreferrer">{systemData.settings.liveClassroom.url}</a>
                </div>
                
                <button
                  type="button"
                  className="dash-btn dash-btn-danger"
                  style={{ width: 'fit-content', marginTop: '1rem' }}
                  onClick={() => handleToggleLiveSession(false)}
                >
                  End Classroom Session
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Session Topic Title</label>
                  <input
                    type="text"
                    className="dash-input"
                    placeholder="e.g. React Router Integration & Guards"
                    value={meetTitle}
                    onChange={e => setMeetTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Zoom / Google Meet Meeting URL</label>
                  <input
                    type="url"
                    className="dash-input"
                    placeholder="https://meet.google.com/..."
                    value={meetUrl}
                    onChange={e => setMeetUrl(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="dash-btn dash-btn-primary"
                  style={{ width: 'fit-content' }}
                  onClick={() => handleToggleLiveSession(true)}
                >
                  Start Live Classroom Session
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. TABS CONTENT: FEEDBACK STREAM */}
      {activeTab === 'Feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
          <span style={{ fontWeight: 700 }}>Cohort Feedback Stream Logs</span>

          <div className="dash-card">
            <span style={{ fontWeight: 700 }}>Send Direct Feedback</span>
            
            <form onSubmit={handlePostFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select Target Associate</label>
                <select className="dash-select" value={selectedInternId} onChange={e => setSelectedInternId(e.target.value)}>
                  {myInterns.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Feedback Comments</label>
                <textarea
                  className="dash-textarea"
                  rows={3}
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Detail comments and improvement tips..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority Warning Level</label>
                <select className="dash-select" value={feedbackPriority} onChange={e => setFeedbackPriority(e.target.value)}>
                  <option value="low">Low Info</option>
                  <option value="medium">Medium Action Required</option>
                  <option value="high">High Critical Priority</option>
                </select>
              </div>

              <button type="submit" className="dash-btn dash-btn-primary" style={{ width: 'fit-content' }}>
                Post Feedback Stream
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 9. TABS CONTENT: MEETINGS */}
      {activeTab === 'Meetings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '650px' }}>
          <span style={{ fontWeight: 700 }}>Schedule Academic Sync Meetings</span>

          <div className="dash-card">
            <span style={{ fontWeight: 700 }}>Schedule Meeting Slot</span>
            <form onSubmit={handleCreateMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Session Agenda / Description</label>
                <input type="text" className="dash-input" placeholder="e.g. Code review on vector endpoints" value={meetDesc} onChange={e => setMeetDesc(e.target.value)} required />
              </div>

              <div className="dash-form-row">
                <div className="form-group">
                  <label className="form-label">Meeting Date</label>
                  <input type="date" className="dash-input" value={meetDate} onChange={e => setMeetDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Meeting Time</label>
                  <input type="time" className="dash-input" value={meetTime} onChange={e => setMeetTime(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Participants (Hold Ctrl to select multiple)</label>
                <select 
                  className="dash-select" 
                  multiple 
                  style={{ height: '100px' }} 
                  value={meetParticipants} 
                  onChange={e => setMeetParticipants(Array.from(e.target.selectedOptions, option => option.value))}
                >
                  {myInterns.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="dash-btn dash-btn-primary" style={{ width: 'fit-content' }}>
                Schedule Sync Meeting
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 10. TABS CONTENT: CHAT CENTER */}
      {activeTab === 'Chat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontWeight: 700 }}>Staff-Intern Chat Room</span>
          <ChatBox currentUser={user} />
        </div>
      )}

      {/* 11. TABS CONTENT: FINAL exit EVALUATIONS */}
      {activeTab === 'Evaluations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '650px' }}>
          <span style={{ fontWeight: 700 }}>Intern Exit Evaluation Reviews</span>

          <div className="dash-card">
            <span style={{ fontWeight: 700 }}>Submit Exit recommendation</span>
            <form onSubmit={handleSubmitEvaluation} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Select Target Associate</label>
                <select className="dash-select" value={selectedInternId} onChange={e => setSelectedInternId(e.target.value)}>
                  {myInterns.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div className="dash-form-row">
                <div className="form-group">
                  <label className="form-label">Technical Skills (0-100)</label>
                  <input type="number" min="0" max="100" className="dash-input" value={evalTech} onChange={e => setEvalTech(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Communication (0-100)</label>
                  <input type="number" min="0" max="100" className="dash-input" value={evalComm} onChange={e => setEvalComm(e.target.value)} required />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="form-group">
                  <label className="form-label">Attendance Quality (0-100)</label>
                  <input type="number" min="0" max="100" className="dash-input" value={evalAtt} onChange={e => setEvalAtt(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Task Completion (0-100)</label>
                  <input type="number" min="0" max="100" className="dash-input" value={evalTask} onChange={e => setEvalTask(e.target.value)} required />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="form-group">
                  <label className="form-label">Problem Solving (0-100)</label>
                  <input type="number" min="0" max="100" className="dash-input" value={evalSolve} onChange={e => setEvalSolve(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Teamwork (0-100)</label>
                  <input type="number" min="0" max="100" className="dash-input" value={evalTeam} onChange={e => setEvalTeam(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Faculty exit Comments & Summary</label>
                <textarea className="dash-textarea" rows={3} value={evalComment} onChange={e => setEvalComment(e.target.value)} placeholder="Provide final remarks on skills..." required />
              </div>

              <div className="form-group">
                <label className="form-label">Certification Exit Recommendation</label>
                <select className="dash-select" value={evalRec} onChange={e => setEvalRec(e.target.value)}>
                  <option value="Complete Internship">Flag Eligible for Internship Certificate</option>
                  <option value="Needs Improvement">Under-performing (Needs Improvement)</option>
                  <option value="Extend Internship">Extend Placement Term duration</option>
                </select>
              </div>

              <button type="submit" className="dash-btn dash-btn-primary" style={{ width: 'fit-content' }}>
                Save exit Evaluation Recommendation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal Assign Trigger */}
      <AssignTask
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        currentActor={user}
        allowedTargets="mentor-scoped"
      />

    </DashboardLayout>
  );
};

export default MentorDashboard;
