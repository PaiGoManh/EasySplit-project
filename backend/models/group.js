const mongoose = require('mongoose')

function arrayLimit(val) {
    return val.length >= 1; 
}

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    members: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'User',
        validate: [arrayLimit, 'Members array must have at least one member'] 
    },
    currency: { type: String, default: 'INR' }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;

