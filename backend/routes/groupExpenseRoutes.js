const express = require('express');
const multer = require('multer');
const GroupSplit = require('../models/groupExpense');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware'); 
const User = require('../models/User');

const upload = multer({ dest: 'uploads/' });

router.post('/add', ensureAuthenticated, upload.single('file'), async (req, res) => {
    try {
        const {
            groupId,
            amount,
            title,
            description,
            splitDetails,
            splitMethod
        } = req.body;
        const file = req.file ? req.file.filename : '';

        if (!groupId || !amount || !splitDetails) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }

        // Get the current user's ObjectId from the authenticated request
        const payerId = req.user._id;

        const groupSplit = new GroupSplit({
            groupId,
            billAmount: amount,
            title,
            description,
            splitDetails: JSON.parse(splitDetails),
            file,
            payer: payerId, // Set to ObjectId
            splitMethod,
            createdAt: new Date()
        });

        await groupSplit.save();
        res.status(201).json({ message: 'Group split added successfully.', groupSplit });
    } catch (error) {
        console.error('Error saving group split:', error);
        res.status(500).json({ message: 'Failed to add group split.' });
    }
});

router.get('/splits/:groupId', ensureAuthenticated, async (req, res) => {
    try {
        const splits = await GroupSplit.find({ groupId: req.params.groupId })
            .populate('payer', 'username avatarUrl')
            .populate('splitDetails.memberId', 'username avatarUrl');
        res.json(splits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/pay/:splitId', ensureAuthenticated, async (req, res) => {
    try {
        const { splitId } = req.params;
        const { amount } = req.body;

        const split = await GroupSplit.findById(splitId);
        if (!split) {
            return res.status(404).json({ message: 'Split not found' });
        }

        const detail = split.splitDetails.find(detail => detail.memberId.toString() === req.user._id.toString());
        if (!detail) {
            return res.status(404).json({ message: 'Detail not found for this user' });
        }

        if (detail.paid) {
            return res.status(400).json({ message: 'Already paid' });
        }

        if (detail.amount !== parseFloat(amount)) {
            return res.status(400).json({ message: 'Amount mismatch' });
        }

        detail.paid = true;
        detail.amount = 0; // Or some other logic to indicate that it’s paid

        await split.save();
        res.status(200).json({ message: 'Payment status updated successfully', data: split });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Settle payment for payer
router.post('/settle/:splitId', ensureAuthenticated, async (req, res) => {
    try {
        const { splitId } = req.params;
        const split = await GroupSplit.findById(splitId);
        if (!split) {
            return res.status(404).json({ message: 'Split not found' });
        }

        // Check if the logged-in user is the payer
        if (split.payer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to settle this split' });
        }

        const allPaid = split.splitDetails.every(detail => detail.paid);

        if (!allPaid) {
            return res.status(400).json({ message: 'Not all members have paid' });
        }

        // Settle the split (logic to be defined, e.g., mark the split as settled)
        // For example, you could add a 'settled' field to your schema
        // split.settled = true;

        await split.save();
        res.status(200).json({ message: 'Split settled successfully', data: split });
    } catch (error) {
        console.error('Error settling split:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/user-amounts/:groupId', ensureAuthenticated, async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const splits = await GroupSplit.find({ groupId })
            .populate('payer', 'username avatarUrl')
            .populate('splitDetails.memberId', 'username avatarUrl');

        let totalExpenses = 0;
        let youOwe = 0;
        let youAreOwed = 0;

        splits.forEach(split => {
            totalExpenses += split.billAmount;
            split.splitDetails.forEach(detail => {
                if (detail.memberId._id.toString() === userId.toString()) {
                    youOwe += detail.amount;
                }
                if (split.payer._id.toString() === userId.toString()) {
                    youAreOwed += detail.amount;
                }
            });
        });

        res.json({ totalExpenses, youOwe, youAreOwed, membersCount: splits.length });
    } catch (error) {
        console.error('Error fetching user amounts:', error);
        res.status(500).json({ message: 'Failed to fetch user amounts.' });
    }
});

router.get('/user-amounts/:groupId', ensureAuthenticated, async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        // Find all group splits
        const splits = await GroupSplit.find({ groupId })
            .populate('payer', 'username avatarUrl')
            .populate('splitDetails.memberId', 'username avatarUrl');

        let totalExpenses = 0;
        let youOwe = 0;
        let youAreOwed = 0;

        // Use a Set to keep track of unique member IDs
        const membersSet = new Set();

        splits.forEach(split => {
            totalExpenses += split.billAmount;
            split.splitDetails.forEach(detail => {
                if (detail.memberId._id.toString() === userId.toString()) {
                    youOwe += detail.amount;
                }
                if (split.payer._id.toString() === userId.toString()) {
                    youAreOwed += detail.amount;
                }
                membersSet.add(detail.memberId._id.toString()); // Add member ID to the Set
            });
        });

        const membersCount = membersSet.size; 

        res.json({ totalExpenses, youOwe, youAreOwed, membersCount });
    } catch (error) {
        console.error('Error fetching user amounts:', error);
        res.status(500).json({ message: 'Failed to fetch user amounts.' });
    }
});


router.get('/totalexpensesofuser', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all splits where the current user is involved
        const splits = await GroupSplit.find({
            $or: [
                { payer: userId },
                { 'splitDetails.memberId': userId }
            ]
        }).populate('payer', 'username avatarUrl')
          .populate('splitDetails.memberId', 'username avatarUrl');

        let totalExpenses = 0;
        let youOwe = 0;
        let youAreOwed = 0;

        splits.forEach(split => {
            totalExpenses += split.billAmount;
            split.splitDetails.forEach(detail => {
                if (detail.memberId._id.toString() === userId.toString()) {
                    youOwe += detail.amount;
                }
                if (split.payer._id.toString() === userId.toString()) {
                    youAreOwed += detail.amount;
                }
            });
        });

        res.json({ totalExpenses, youOwe, youAreOwed });
    } catch (error) {
        console.error('Error fetching total expenses:', error);
        res.status(500).json({ message: 'Failed to fetch total expenses.' });
    }
});

module.exports = router;
