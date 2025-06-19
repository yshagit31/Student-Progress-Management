import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  cronSchedule: {
    type: String,
    default: '0 2 * * *'
  },
  cronTimezone: {
    type: String,
    default: 'UTC'
  },
  emailSettings: {
    smtpHost: { type: String, default: 'smtp.gmail.com' },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String },
    smtpPass: { type: String },
    fromEmail: { type: String },
    fromName: { type: String, default: 'SPMS' }
  },
  inactivityThreshold: {
    type: Number,
    default: 7 
  },
  lastSyncTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Settings', settingsSchema);