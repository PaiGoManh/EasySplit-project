const User = require('../models/User');

const ensureAuthenticated = async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId).select('-password');
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = user; 
            next();
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { ensureAuthenticated };
