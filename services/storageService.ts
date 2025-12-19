import { ChatSession, UserProfile, Message } from '../types';

const STORAGE_KEYS = {
  USER: 'neuralmark_user',
  SESSIONS: 'neuralmark_sessions',
  CURRENT_SESSION: 'neuralmark_current_session_id'
};

const DAILY_TOKENS = 100000;

export const loadUser = (): UserProfile | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  if (!stored) return null;
  
  const user: UserProfile = JSON.parse(stored);
  
  // Migration for existing users who might not have this field
  if (user.dailyNoteGenerations === undefined) {
    user.dailyNoteGenerations = 0;
  }
  
  // Check daily reset
  const today = new Date().toDateString();
  const lastReset = new Date(user.lastReset).toDateString();
  
  if (today !== lastReset && user.plan === 'free') {
    user.tokens = DAILY_TOKENS;
    user.dailyNoteGenerations = 0;
    user.lastReset = new Date().toISOString();
    saveUser(user);
  }
  
  return user;
};

export const saveUser = (user: UserProfile) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const createInitialUser = (email: string, name: string): UserProfile => {
  const user: UserProfile = {
    id: Date.now().toString(),
    email,
    name,
    plan: 'free',
    tokens: DAILY_TOKENS,
    dailyNoteGenerations: 0,
    lastReset: new Date().toISOString()
  };
  saveUser(user);
  return user;
};

export const loadSessions = (): ChatSession[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveSession = (session: ChatSession) => {
  const sessions = loadSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }
  
  // Sort by newest
  sessions.sort((a, b) => b.updatedAt - a.updatedAt);
  
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
};

export const createNewSession = (): ChatSession => {
  return {
    id: Date.now().toString(),
    title: 'New Discussion',
    messages: [],
    updatedAt: Date.now()
  };
};

export const deleteSession = (sessionId: string) => {
  const sessions = loadSessions().filter(s => s.id !== sessionId);
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
};