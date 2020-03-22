const express = require('express')
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/users.controller');

router.post('/register', userController.validateRegister, userController.registerUser);
router.post('/login', passport.authenticate('local'), (req, res) => {
    
    console.log(JSON.stringify(req.user));
    console.log(req.user);
    
    res.send({
        success: true,
        payload: {
            user: req.user
        }
    });
});

router.get('/test', (req, res) => {
    if(req.isAuthenticated) {
        return res.send(JSON.stringify(req.user));
    }
     res.send('JSON.stringify({})');
})

router.post('/verify', userController.isAuthenticated, (req, res) => {
    res.send({
        success: true,
        payload: {
            user: req.user
        }
    })
})

router.get("/logout", (req, res) => {
  //req.logout();
  //res.clearCookie("sid");

  req.session.destroy(err => {
    if (err) {
      return res.send({
        success: false,
        message: "Server error: couldn't destroy session (log user out)"
      });
    }
    req.logout();
    res.clearCookie("sid").send(JSON.stringify({
      success: true,
      message: "Successfully logged out"
    }));
  });
});

module.exports = router;