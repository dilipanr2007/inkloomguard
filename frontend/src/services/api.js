import axios from 'axios';
import {
  DEMO_STATS,
  DEMO_CONTENTS,
  DEMO_SUBMISSION_DETAILS,
  DEMO_GUIDELINES,
  DEMO_TERMINOLOGY,
  DEMO_FACTS,
  DEMO_ASSETS,
  DEMO_ANALYTICS_FINDINGS,
  DEMO_ANALYTICS_RULES,
  DEMO_AUDIT_LOGS,
  DEMO_USERS
} from './demoData';

// Public Demo Mode flag for CodeNexus India 2026 Hackathon judging
// Set to true to bypass login screens, deliver instant grounded demo responses, and enforce read-only safety.
// Easily toggleable back to false post-judging (or via VITE_PUBLIC_DEMO_MODE=false in environment).
export const PUBLIC_DEMO_MODE = import.meta.env.VITE_PUBLIC_DEMO_MODE !== 'false';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20s timeout to prevent hanging promises
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to provide source-grounded demo data for CodeNexus India 2026
const getDemoResponse = (config) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  if (method === 'get') {
    if (url.includes('/analytics/overview')) {
      return { stats: DEMO_STATS };
    }
    if (url.includes('/analytics/findings')) {
      return DEMO_ANALYTICS_FINDINGS;
    }
    if (url.includes('/analytics/rules')) {
      return DEMO_ANALYTICS_RULES;
    }
    if (url.includes('/content') && url.includes('/compare')) {
      return {
        v1: DEMO_SUBMISSION_DETAILS.allVersions[0],
        v2: DEMO_SUBMISSION_DETAILS.allVersions[1]
      };
    }
    if (url.match(/\/content\/[a-zA-Z0-9_-]+/)) {
      return DEMO_SUBMISSION_DETAILS;
    }
    if (url.includes('/content')) {
      let filtered = [...DEMO_CONTENTS];
      if (config.params?.status && config.params.status !== 'all') {
        filtered = filtered.filter((c) => c.status === config.params.status);
      }
      if (config.params?.limit) {
        filtered = filtered.slice(0, parseInt(config.params.limit, 10));
      }
      return { contents: filtered };
    }
    if (url.includes('/guidelines')) {
      return { guidelines: DEMO_GUIDELINES };
    }
    if (url.includes('/terminology')) {
      return { terminology: DEMO_TERMINOLOGY };
    }
    if (url.includes('/facts')) {
      return { facts: DEMO_FACTS };
    }
    if (url.includes('/assets')) {
      return { assets: DEMO_ASSETS };
    }
    if (url.includes('/audit')) {
      return { logs: DEMO_AUDIT_LOGS };
    }
    if (url.includes('/auth/me')) {
      const savedRole = localStorage.getItem('inkloom_demo_role') || 'manager';
      return { user: DEMO_USERS[savedRole] || DEMO_USERS.manager };
    }
    return null;
  }

  // Read-only Demo mutations: return safe mock response without changing production DB
  if (method === 'post') {
    if (url.includes('/content')) {
      return {
        success: true,
        content: DEMO_CONTENTS[0],
        message: 'Demo content submission recorded in memory for evaluation.'
      };
    }
    if (url.includes('/review')) {
      return {
        success: true,
        message: 'AI Review completed successfully with 4 source-grounded findings.'
      };
    }
  }

  return {
    success: true,
    message: 'Public Demo Mode: Simulated mutation applied locally for evaluation.'
  };
};

// Use an Axios adapter interceptor when in PUBLIC_DEMO_MODE to guarantee 0ms latency,
// instant offline/incognito support, and strict read-only backend isolation.
const originalAdapter = axios.defaults.adapter;
api.defaults.adapter = async (config) => {
  if (PUBLIC_DEMO_MODE) {
    const demoData = getDemoResponse(config);
    if (demoData) {
      return {
        data: demoData,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        request: {}
      };
    }
  }

  if (typeof originalAdapter === 'function') {
    return originalAdapter(config);
  }

  // Fallback to fetch adapter in modern Axios
  return axios.getAdapter(config.adapter || 'xhr')(config);
};

api.interceptors.request.use(
  (config) => {
    // Check if the request is for an unauthenticated public auth route
    const isPublicAuthRoute = config.url && (
      config.url.includes('/auth/login') ||
      config.url.includes('/auth/register')
    );

    if (isPublicAuthRoute) {
      if (config.headers && config.headers.Authorization) {
        delete config.headers.Authorization;
      }
    } else {
      const token = localStorage.getItem('inkloom_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
      const timeoutMessage = 'Server response timed out. The server may be waking up or experiencing high latency. Please retry.';
      if (!error.response) {
        error.response = { data: { success: false, message: timeoutMessage }, status: 408 };
      } else if (error.response.data) {
        error.response.data.message = timeoutMessage;
      }
    } else if (!error.response && error.request) {
      const networkMessage = 'Unable to reach the Inkloom server. Please check your connection and try again.';
      error.response = { data: { success: false, message: networkMessage }, status: 503 };
    }

    if (error.response && error.response.status === 401) {
      const isLoginOrRegister = error.config?.url && (
        error.config.url.includes('/auth/login') ||
        error.config.url.includes('/auth/register')
      );

      if (!isLoginOrRegister) {
        localStorage.removeItem('inkloom_token');
        localStorage.removeItem('inkloom_user');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
