require('dotenv').config()
const express= require('express')
const ex = express()
const passport = require('passport')
ex.set('view engine','ejs')
require('./passport')

//cookie session is mandatory if you dont wanna see display name as undefined
const cookiesession= require('cookie-session') 
ex.use(cookiesession({
    name:'tuto-session',
    keys:['key1','key2']
}))

ex.use(passport.initialize())
ex.use(passport.session());

ex.get('/',(req,res,next)=>{
    res.render('signup')
})
ex.get('/signin',(req,res,next)=>{
    res.render('signin')
})

ex.get('/google',passport.authenticate('google',{scope: ['profile','email'] }));

ex.get('/google/callback',
 passport.authenticate('google',{failureRedirect:'/loginfailed'}),
 (req,res)=>{
     res.redirect('/loginsuccess')
 }
)

ex.get('/loginfailed',(req,res)=>{
    res.sendStatus(401)
})
function loginmiddileware( req,res,next) {
    if(req.user){
        next()
    }
    else{
        res.sendStatus(401)
    }
}

ex.get('/loginsuccess',loginmiddileware,(req,res)=>{
 
    res.render('homepage',{name:req.user.displayName,picture:req.user.picture,email:req.user.email})

})

ex.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
ex.use( '/',(req,res)=>{
 res.send('404 page not found')
})

ex.listen(3000);