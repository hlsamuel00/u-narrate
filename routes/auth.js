const express = require('express')
const passport = require('passport')
const router = express.Router()


// @description     Authenticate with Google
// @route           GET /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile']}))

// @description     Authenticate with Facebook
// @route           GET /auth/facebook

router.get('/facebook', passport.authenticate('facebook', {scope: ['public_profile']}))


// @description     Google Authentication callback
// @route           GET /auth/google/callback

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req,res) => {
    res.redirect('/dashboard')
})

// @description     Facebook Authentication callback
// @route           GET /auth/facebook/callback

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req,res) => {
    res.redirect('/dashboard')
})

// @description     Logout User
// @route           GET /auth/logout

router.get('/logout', (req,res) => {
    req.logOut((err) => err ? next(err) : res.redirect('/'))
    //logout requires a callback function. had to recreate the method using a callback which then executes the redirect to the home page
})


module.exports = router