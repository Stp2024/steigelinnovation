import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { getSystemData, updateSystemData } from '../lib/systemStore';

export const ChatBox = ({ currentUser }) => {
  const [data, setData] = useState(getSystemData());
  const [activeContactId, setActiveContactId] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Sync state on systemStoreUpdate
  useEffect(() => {
    const handleUpdate = () => {
      setData(getSystemData());
    };
    window.addEventListener('systemStoreUpdate', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('systemStoreUpdate', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Filter contacts based on user role
  const contacts = (() => {
    if (!currentUser) return [];
    if (currentUser.role === 'mentor') {
      // Mentor can message their assigned interns
      const mentorObj = data.mentors.find(m => m.id === currentUser.id);
      if (!mentorObj) return [];
      return data.interns
        .filter(i => mentorObj.assignedInterns.includes(i.id))
        .map(i => ({ id: i.id, name: i.name, role: 'Intern', email: i.email }));
    } else if (currentUser.role === 'intern') {
      // Intern can message their mentor
      const internObj = data.interns.find(i => i.id === currentUser.id);
      if (!internObj) return [];
      const mentorObj = data.mentors.find(m => m.id === internObj.mentorId);
      const list = [];
      if (mentorObj) {
        list.push({ id: mentorObj.id, name: mentorObj.name, role: 'Mentor', email: mentorObj.email });
      }
      // Also allow other interns in their batch
      const batchInterns = data.interns
        .filter(i => i.id !== currentUser.id && i.batch === internObj.batch)
        .map(i => ({ id: i.id, name: i.name, role: 'Intern', email: i.email }));
      return [...list, ...batchInterns];
    } else if (currentUser.role === 'admin') {
      // Admin can message anyone
      const mentorsList = data.mentors.map(m => ({ id: m.id, name: m.name, role: 'Mentor', email: m.email }));
      const internsList = data.interns.map(i => ({ id: i.id, name: i.name, role: 'Intern', email: i.email }));
      return [...mentorsList, ...internsList];
    }
    return [];
  })();

  // Set first contact active if not set
  useEffect(() => {
    if (contacts.length > 0 && !activeContactId) {
      setActiveContactId(contacts[0].id);
    }
  }, [contacts, activeContactId]);

  // Scroll to bottom of message feed
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data.messages, activeContactId]);

  const activeContact = contacts.find(c => c.id === activeContactId);

  // Filter messages between current user and active contact
  const conversationMessages = data.messages.filter(msg => {
    return (
      (msg.senderId === currentUser?.id && msg.receiverId === activeContactId) ||
      (msg.senderId === activeContactId && msg.receiverId === currentUser?.id)
    );
  }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeContactId || !currentUser) return;

    const activeData = getSystemData();
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: activeContactId,
      text: typedMessage.trim(),
      timestamp: new Date().toISOString()
    };

    activeData.messages.push(newMsg);
    
    // Also push a notification to receiver
    const receiverNotif = {
      id: `notif-${Date.now()}`,
      userId: activeContactId,
      text: `New chat message from ${currentUser.name}: "${typedMessage.trim().substring(0, 30)}${typedMessage.trim().length > 30 ? '...' : ''}"`,
      read: false,
      timestamp: new Date().toISOString()
    };
    activeData.notifications.unshift(receiverNotif);

    updateSystemData(activeData);
    setTypedMessage('');
  };

  return (
    <div className="chat-container">
      {/* Contacts List Panel */}
      <div className="chat-sidebar">
        <div className="chat-search-bar" style={{ fontSize: '0.85rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
          Direct Messages
        </div>
        <ul className="chat-user-list">
          {contacts.length === 0 ? (
            <li style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              No contacts available.
            </li>
          ) : (
            contacts.map(c => {
              // Find last message
              const lastMsg = data.messages.filter(msg => 
                (msg.senderId === currentUser.id && msg.receiverId === c.id) ||
                (msg.senderId === c.id && msg.receiverId === currentUser.id)
              ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

              return (
                <li
                  key={c.id}
                  className={`chat-user-item ${activeContactId === c.id ? 'active' : ''}`}
                  onClick={() => setActiveContactId(c.id)}
                >
                  <div className="chat-user-name">{c.name}</div>
                  <div className="chat-user-meta">
                    <span>{c.role}</span>
                    {lastMsg && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>
                        {lastMsg.text}
                      </span>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Message Feed Panel */}
      <div className="chat-feed">
        {activeContact ? (
          <>
            <div className="chat-feed-header">
              <div style={{ fontWeight: 700 }}>{activeContact.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{activeContact.role} • {activeContact.email}</div>
            </div>
            
            <div className="chat-feed-messages">
              {conversationMessages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No messages yet. Send a message to start the conversation!
                </div>
              ) : (
                conversationMessages.map(msg => {
                  const isSentByMe = msg.senderId === currentUser.id;
                  const dateStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble-container ${isSentByMe ? 'sent' : 'received'}`}
                    >
                      <div className="chat-bubble">
                        {msg.text}
                      </div>
                      <span className="chat-bubble-timestamp">{dateStr}</span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-feed-input">
              <input
                type="text"
                className="dash-input"
                placeholder="Type a message..."
                value={typedMessage}
                onChange={e => setTypedMessage(e.target.value)}
              />
              <button type="submit" className="dash-btn dash-btn-primary" style={{ padding: '0.75rem 1rem' }}>
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
            Please select a contact to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
