import axios from 'axios';
import {
  DEMO_STATS,
  DEMO_CONTENTS,
  DEMO_SUBMISSION_DETAILS,
  getDemoSubmissionDetails,
  DEMO_GUIDELINES,
  DEMO_INTERNAL_GUIDELINES,
  DEMO_REGULATORY,
  DEMO_PRODUCTS,
  DEMO_TERMINOLOGY,
  DEMO_FACTS,
  DEMO_ASSETS,
  DEMO_ANALYTICS_FINDINGS,
  DEMO_ANALYTICS_RULES,
  DEMO_AUDIT_LOGS,
  DEMO_USERS,
  saveCustomDemoSubmission,
  analyzeDemoText,
  updateDemoContentStatus,
  recordDemoAuditLog
} from './demoData';

// Public Demo Mode flag for CodeNexus India 2026 Hackathon judging
// Set to true to bypass login screens, deliver instant grounded demo responses, and enforce read-only safety.
// Easily toggleable back to false post-judging (or via VITE_PUBLIC_DEMO_MODE=false in environment).
export const PUBLIC_DEMO_MODE = import.meta.env.VITE_PUBLIC_DEMO_MODE !== 'false';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      const match = url.match(/\/content\/([a-zA-Z0-9_-]+)\/compare/);
      const subId = match ? match[1] : 'demo-submission-1';
      const details = getDemoSubmissionDetails(subId);
      return {
        v1: details.allVersions?.[0] || details.currentVersion,
        v2: details.allVersions?.[1] || details.currentVersion
      };
    }
    const singleContentMatch = url.match(/\/content\/([a-zA-Z0-9_-]+)$/);
    if (singleContentMatch) {
      const subId = singleContentMatch[1];
      return getDemoSubmissionDetails(subId);
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
      return {
        guidelines: DEMO_GUIDELINES,
        internalGuidelines: DEMO_INTERNAL_GUIDELINES,
        regulatory: DEMO_REGULATORY
      };
    }
    if (url.includes('/regulatory')) {
      return { regulatory: DEMO_REGULATORY };
    }
    if (url.includes('/products')) {
      return { products: DEMO_PRODUCTS };
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

  // Handle Onboarding Preferences Updates in Demo Mode
  if (method === 'patch' || method === 'post') {
    if (url.includes('/auth/onboarding')) {
      let body = {};
      try {
        body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
      } catch (e) {
        body = {};
      }
      const savedRole = localStorage.getItem('inkloom_demo_role') || 'manager';
      if (DEMO_USERS[savedRole]) {
        DEMO_USERS[savedRole].onboarding = {
          completed: body.completed !== undefined ? Boolean(body.completed) : DEMO_USERS[savedRole].onboarding?.completed || false,
          skipped: body.skipped !== undefined ? Boolean(body.skipped) : DEMO_USERS[savedRole].onboarding?.skipped || false,
          version: body.version || 1
        };
      }
      return {
        success: true,
        onboarding: DEMO_USERS[savedRole]?.onboarding,
        message: 'Onboarding updated in demo mode.'
      };
    }
  }

  // Safe In-Memory Demo Mutations: Handle locally without calling production backend
  if (method === 'post') {
    if (url.includes('/approve')) {
      const subId = url.match(/\/content\/([a-zA-Z0-9_-]+)\/approve/)?.[1] || 'demo-submission-1';
      updateDemoContentStatus(subId, 'approved');
      recordDemoAuditLog({
        action: 'CONTENT_APPROVED (Demo)',
        targetId: subId,
        details: { note: 'Approved in Demo Mode' }
      });
      return { success: true, message: 'Content approved in demo mode.' };
    }
    if (url.includes('/request-changes')) {
      const subId = url.match(/\/content\/([a-zA-Z0-9_-]+)\/request-changes/)?.[1] || 'demo-submission-1';
      updateDemoContentStatus(subId, 'changes_requested');
      recordDemoAuditLog({
        action: 'CHANGES_REQUESTED (Demo)',
        targetId: subId,
        details: { note: 'Changes requested in demo mode' }
      });
      return { success: true, message: 'Changes requested in demo mode.' };
    }
    if (url.includes('/reject')) {
      const subId = url.match(/\/content\/([a-zA-Z0-9_-]+)\/reject/)?.[1] || 'demo-submission-1';
      updateDemoContentStatus(subId, 'rejected');
      recordDemoAuditLog({
        action: 'CONTENT_REJECTED (Demo)',
        targetId: subId,
        details: { note: 'Rejected in demo mode' }
      });
      return { success: true, message: 'Content rejected in demo mode.' };
    }
    if (url.includes('/review')) {
      const subId = url.match(/\/content\/([a-zA-Z0-9_-]+)\/review/)?.[1] || 'demo-submission-1';
      const details = getDemoSubmissionDetails(subId);
      const text = details.currentVersion?.rawText || '';
      const analysis = analyzeDemoText(text);
      details.currentVersion.governanceScore = analysis.score;
      details.currentVersion.totalFindings = analysis.findings.length;
      details.currentVersion.aiReviewCompleted = true;
      details.findings = analysis.findings;
      return {
        success: true,
        findings: analysis.findings,
        governanceScore: analysis.score,
        message: 'AI Review completed successfully with source-grounded findings.'
      };
    }
    if (url.includes('/content')) {
      let body = {};
      try {
        body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
      } catch (e) {
        body = {};
      }
      const newSub = saveCustomDemoSubmission(body);
      return {
        success: true,
        content: newSub,
        message: 'Demo content submission recorded and evaluated in memory.'
      };
    }
  }

  return {
    success: true,
    message: 'Public Demo Mode: Simulated mutation applied locally for evaluation.'
  };
};

// Custom adapter that intercepts all calls when PUBLIC_DEMO_MODE is true
const demoAdapter = async (config) => {
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

  // Fallback to real HTTP transport when not in demo mode
  const fetchAdapter = axios.getAdapter(config.adapter || 'xhr');
  return fetchAdapter(config);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  adapter: demoAdapter,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
