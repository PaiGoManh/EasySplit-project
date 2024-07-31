const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userProfileSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String, required: true },
    photo: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model('userProfile', userProfileSchema);

module.exports = UserProfile;
