
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  action: { type: DataTypes.STRING(50), allowNull: false },   // e.g. CREATE / READ / UPDATE_STATUS
  entity: { type: DataTypes.STRING(50), allowNull: false },   // e.g. "Task"
  entityId: { type: DataTypes.STRING, allowNull: true },      // mongo _id as string
  details: { type: DataTypes.JSONB, allowNull: true },
}, {
  tableName: 'AuditLogs',
  timestamps: true,
});

module.exports = AuditLog;
