import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, User } from 'lucide-react';
import { getSystemData, updateSystemData, clearSession, subscribeToSystemStore } from '../lib/systemStore';

export const DashboardLayout = ({
  user,
  activeTab,
  setActiveTab,
  menuItems = [],
  children
}) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [systemData, setSystemData] = useState(getSystemData());

  // Subscribe to system store updates for real-time changes
  useEffect(() => {
    const unsubscribe = subscribeToSystemStore((newData) => {
      setSystemData(newData);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  // Filter notifications for this specific user
  const userNotifications = systemData.notifications ? 
    systemData.notifications.filter(n => n.userId === user?.id) : [];
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    const activeData = getSystemData();
    activeData.notifications.forEach(n => {
      if (n.userId === user?.id) {
        n.read = true;
      }
    });
    updateSystemData(activeData);
  };

  const handleBellClick = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  // Close notifications dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notif-bell-container')) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Live classroom state
  const liveClassroom = systemData.settings?.liveClassroom;
  const showLiveBanner = user?.role === 'intern' && liveClassroom?.active;

  return (
    <div className="dashboard-theme">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="dash-container">
        {/* Sidebar Component */}
        <aside className={`dash-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="dash-sidebar-logo">
            STEIGLE HUB <span>LVL {user?.level}</span>
          </div>

          <ul className="dash-sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name} className="dash-sidebar-item">
                  <button
                    onClick={() => {
                      setActiveTab(item.name);
                      setSidebarOpen(false);
                    }}
                    className={`dash-sidebar-link ${activeTab === item.name ? 'active' : ''}`}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Sidebar Footer / User Profile Summary */}
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'rgba(184, 146, 61, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(184, 146, 61, 0.15)', color: 'var(--accent-dash)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                <User size={16} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="dash-sidebar-link" 
              style={{ width: '100%', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.08)', color: '#EF4444', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem' }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="dash-content">
          {/* Live Classroom Banner */}
          {showLiveBanner && (
            <div className="live-classroom-bar">
              <div className="live-classroom-title">
                <div className="live-classroom-pulse" />
                <span>🔴 LIVE NOW: {liveClassroom.title}</span>
              </div>
              <a 
                href={liveClassroom.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-join-live"
              >
                Join Live
              </a>
            </div>
          )}

          {/* Top Bar Navigation */}
          <div className="dash-topnav">
            <div className="dash-topnav-left">
              <button 
                className="menu-trigger" 
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar menu"
              >
                <Menu size={24} />
              </button>
              <h2 className="dash-topnav-title" style={{ margin: 0 }}>{activeTab}</h2>
            </div>

            <div className="dash-topnav-right">
              {/* Notifications Dropdown Container */}
              <div className="notif-bell-container">
                <button 
                  onClick={handleBellClick}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '4px', position: 'relative' }}
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && <div className="notif-badge">{unreadCount}</div>}
                </button>

                {notifOpen && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span>Notifications</span>
                      {unreadCount > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>{unreadCount} unread</span>}
                    </div>
                    <div className="notif-list">
                      {userNotifications.length === 0 ? (
                        <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          No notifications.
                        </div>
                      ) : (
                        userNotifications.map(n => (
                          <div key={n.id} className="notif-item" style={{ opacity: n.read ? 0.6 : 1 }}>
                            <div>{n.text}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {user?.role === 'admin' ? 'Administrator' : user?.role === 'mentor' ? 'Mentor Officer' : 'Intern Associate'}
                </span>
              </div>
            </div>
          </div>

          {/* Render Active View Tab Content */}
          <div className="dash-view-body">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
