const AuditLog = require('../models/AuditLog');

const logAudit = async ({ user, role, action, targetResource, targetId, details }) => {
  try {
    await AuditLog.create({
      user: user?._id || user?.id || null,
      userEmail: user?.email || 'system@inkloomguard.xyz',
      role: role || user?.role || 'system',
      action,
      targetResource,
      targetId: targetId ? targetId.toString() : '',
      details: details || {}
    });
  } catch (error) {
    console.error('[Audit Log Error]', error.message);
  }
};

module.exports = { logAudit };
