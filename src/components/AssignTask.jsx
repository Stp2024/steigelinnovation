import React, { useState } from 'react';
import { X } from 'lucide-react';
import { getSystemData, updateSystemData, logAudit, pushNotification } from '../lib/systemStore';

export const AssignTask = ({ isOpen, onClose, currentActor = null, allowedTargets = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [targetType, setTargetType] = useState('single'); // 'single', 'batch', 'dept', 'all'
  const [assignedInternId, setAssignedInternId] = useState('');
  const [targetBatch, setTargetBatch] = useState('');
  const [targetDept, setTargetDept] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const data = getSystemData();

  // Dropdown options
  const projects = data.projects.filter(p => p.status === 'active');
  const mentors = data.mentors;
  
  // Filter interns list based on current actor (if mentor, only assigned interns)
  const availableInterns = data.interns.filter(intern => {
    if (currentActor && currentActor.role === 'mentor') {
      return intern.mentorId === currentActor.id;
    }
    return true;
  });

  // Extract unique batches and departments
  const batches = [...new Set(data.interns.map(i => i.batch).filter(Boolean))];
  const depts = [...new Set(data.interns.map(i => i.department).filter(Boolean))];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!title.trim()) return setErrorMsg('Task title is required.');
    if (!description.trim()) return setErrorMsg('Task description is required.');
    if (!projectId) return setErrorMsg('Project association is required.');
    if (targetType === 'single' && !assignedInternId) return setErrorMsg('Please assign an intern.');
    if (targetType === 'batch' && !targetBatch) return setErrorMsg('Please select a batch.');
    if (targetType === 'dept' && !targetDept) return setErrorMsg('Please select a department.');
    if (!deadline) return setErrorMsg('Deadline date is required.');

    const activeData = getSystemData();
    const project = activeData.projects.find(p => p.id === projectId);
    const actorName = currentActor ? currentActor.name : 'Admin';
    const actorId = currentActor ? currentActor.id : 'admin';
    const mentorId = currentActor && currentActor.role === 'mentor' ? currentActor.id : (project ? project.mentorId : '');

    // Determine target interns
    let targets = [];
    if (targetType === 'single') {
      targets = [activeData.interns.find(i => i.id === assignedInternId)];
    } else if (targetType === 'batch') {
      targets = activeData.interns.filter(i => i.batch === targetBatch);
    } else if (targetType === 'dept') {
      targets = activeData.interns.filter(i => i.department === targetDept);
    } else if (targetType === 'all') {
      targets = availableInterns;
    }

    if (targets.length === 0) {
      return setErrorMsg('No interns found matching the selected target criteria.');
    }

    // Create tasks
    const newTasks = targets.map(intern => ({
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      description,
      projectId,
      assignedInternId: intern.id,
      mentorId: mentorId || intern.mentorId,
      priority,
      deadline,
      status: 'pending',
      repositoryLink: repoLink
    }));

    activeData.tasks.push(...newTasks);
    updateSystemData(activeData);

    // Logs and notifications
    newTasks.forEach(task => {
      logAudit(
        'TASK_ASSIGNED',
        actorName,
        actorId,
        `Task for ${targets.find(t => t.id === task.assignedInternId)?.name || 'Intern'}`,
        { title: task.title, deadline: task.deadline }
      );

      pushNotification(
        task.assignedInternId,
        `New task assigned by ${actorName}: "${task.title}"`
      );
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Assign New Task</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="dash-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Implement User Authentication"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="dash-textarea"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Detail task requirements and outputs required..."
              />
            </div>

            <div className="dash-form-row">
              <div className="form-group">
                <label className="form-label">Associated Project *</label>
                <select className="dash-select" value={projectId} onChange={e => setProjectId(e.target.value)}>
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="dash-select" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="dash-form-row">
              <div className="form-group">
                <label className="form-label">Target Audience *</label>
                <select
                  className="dash-select"
                  value={targetType}
                  onChange={e => { setTargetType(e.target.value); setErrorMsg(''); }}
                >
                  <option value="single">Single Intern</option>
                  {!allowedTargets && <option value="batch">Specific Batch</option>}
                  {!allowedTargets && <option value="dept">Specific Department</option>}
                  {!allowedTargets && <option value="all">All Assigned Interns</option>}
                </select>
              </div>

              {targetType === 'single' && (
                <div className="form-group">
                  <label className="form-label">Select Intern *</label>
                  <select className="dash-select" value={assignedInternId} onChange={e => setAssignedInternId(e.target.value)}>
                    <option value="">Select Intern</option>
                    {availableInterns.map(i => (
                      <option key={i.id} value={i.id}>{i.name} ({i.batch || 'No Batch'})</option>
                    ))}
                  </select>
                </div>
              )}

              {targetType === 'batch' && (
                <div className="form-group">
                  <label className="form-label">Select Batch *</label>
                  <select className="dash-select" value={targetBatch} onChange={e => setTargetBatch(e.target.value)}>
                    <option value="">Select Batch</option>
                    {batches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              {targetType === 'dept' && (
                <div className="form-group">
                  <label className="form-label">Select Department *</label>
                  <select className="dash-select" value={targetDept} onChange={e => setTargetDept(e.target.value)}>
                    <option value="">Select Department</option>
                    {depts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="dash-form-row">
              <div className="form-group">
                <label className="form-label">Deadline Date *</label>
                <input
                  type="date"
                  className="dash-input"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Repository / Resource Link (Optional)</label>
                <input
                  type="url"
                  className="dash-input"
                  value={repoLink}
                  onChange={e => setRepoLink(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="dash-btn dash-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="dash-btn dash-btn-primary">Assign Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTask;
