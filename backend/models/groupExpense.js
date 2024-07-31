const mongoose = require('mongoose');

const groupSplitSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    billAmount: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        default: 'No Title'
    },
    description: {
        type: String,
        default: 'No Description'
    },
    splitMethod: {
        type: String,
        enum: ['equal', 'custom'],
        required: true
    },
    splitDetails: [
        {
            memberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            paid: {
                type: Boolean,
                default: false
            }
        }
    ],
    file: {
        type: String,
        default: ''
    },
    payer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const GroupSplit = mongoose.model('GroupSplit', groupSplitSchema);

module.exports = GroupSplit;
