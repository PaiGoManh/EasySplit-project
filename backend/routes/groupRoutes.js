const express = require('express');
const router = express.Router();
const Group = require('../models/group');
const { ensureAuthenticated } = require('../middleware/authMiddleware'); 


router.post('/addgroup', ensureAuthenticated, async (req, res) => {
    const { name, description, members, currency } = req.body;
    try {
      const newGroup = new Group({ name, description, members, currency });
      await newGroup.save();
      res.status(201).json({ group: newGroup });
    } catch (error) {
      console.error('Error adding group:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  router.get('/getgroups', ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const groups = await Group.find({ members: userId })
        .populate('members', 'username')
        .exec();
      res.status(200).json({ groups });
    } catch (error) {
      console.error('Error fetching groups:', error.message);
      res.status(500).json({ message: error.message });
    }
  });
  


router.get('/getgroup/:id',ensureAuthenticated, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('members', 'username') 
            .exec();

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ group });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/updategroup/:id',ensureAuthenticated, async (req, res) => {
    const { name, description, members, currency } = req.body;
    try {
        const updatedGroup = await Group.findByIdAndUpdate(req.params.id, { name, description, members, currency }, { new: true });
        res.status(200).json({ group: updatedGroup });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/deletegroup/:id',ensureAuthenticated, async (req, res) => {
    try {
        await Group.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/groupCount', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming userId is stored in session
    const groupCount = await Group.countDocuments({ members: userId });
    res.json({ count: groupCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching group count' });
  }
});
module.exports = router;
