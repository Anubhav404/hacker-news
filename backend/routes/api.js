const express = require('express');
const router = express.Router();

// Sample route to test authentication
router.get('/user', isLoggedIn, (req, res) => {
  res.json(req.user);
});

// Middleware to check if the user is authenticated
function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
    return next();
//   }
//   res.sendStatus(401); // Unauthorized
}

module.exports = router;
