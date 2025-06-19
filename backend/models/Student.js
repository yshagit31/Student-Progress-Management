import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
  contestId: { type: Number, required: true },
  contestName: { type: String, required: true },
  handle: { type: String, required: true },
  rank: { type: Number, required: true },
  oldRating: { type: Number, required: true },
  newRating: { type: Number, required: true },
  ratingUpdateTimeSeconds: { type: Number, required: true },
  problemsSolved: { type: Number, default: 0 },
  totalProblems: { type: Number, default: 0 }
});

const submissionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  contestId: { type: Number, required: true },
  creationTimeSeconds: { type: Number, required: true },
  relativeTimeSeconds: { type: Number, required: true },
  problem: {
    contestId: { type: Number },
    index: { type: String },
    name: { type: String },
    type: { type: String },
    rating: { type: Number },
    tags: [{ type: String }]
  },
  author: {
    contestId: { type: Number },
    members: [{
      handle: { type: String }
    }],
    participantType: { type: String },
    ghost: { type: Boolean },
    startTimeSeconds: { type: Number }
  },
  programmingLanguage: { type: String },
  verdict: { type: String },
  testset: { type: String },
  passedTestCount: { type: Number },
  timeConsumedMillis: { type: Number },
  memoryConsumedBytes: { type: Number }
});

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  codeforcesHandle: {
    type: String,
    required: true,
    trim: true
  },
  currentRating: {
    type: Number,
    default: 0
  },
  maxRating: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  contests: [contestSchema],
  submissions: [submissionSchema],
  emailNotificationsEnabled: {
    type: Boolean,
    default: true
  },
  reminderEmailCount: {
    type: Number,
    default: 0
  },
  lastReminderSent: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
studentSchema.index({ email: 1 });
studentSchema.index({ codeforcesHandle: 1 });
studentSchema.index({ lastUpdated: 1 });

export default mongoose.model('Student', studentSchema);