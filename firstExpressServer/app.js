'use strict'

const path = require( 'path' )
const util = require( 'util' )

const express = require( 'express' )

const app = express()
const hbs = require('express-handlebars')
const bodyParser = require( 'body-parser' )
var session = require( 'express-session' )

const port = 3000

var userData = require( './lib/user_data' )

/* --- middleware --- */
app.use( express.static( path.join( __dirname, 'public' )))

app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({ extended: true }))

app.engine('handlebars', hbs())
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true } <------ hier lag der Hase im Pfeffer! ------- ;)
}))

/* --- routes --- */
app.get( '/', ( req, res )=>{
  res.redirect( '/login' )
})

app.get( '/user', ( req, res )=>{
  res.render( 'user', { title: 'User', user: userData })
})

app.get( '/login', ( req, res )=>{
  res.render( 'login', { title: 'Login' } )
})

app.post( '/login', ( req, res )=>{
  // check username & password
  util.log(  'body:',  util.inspect( req.body ))
  if( req.body.email == userData.email ){
    if( req.body.password == userData.password ){
      req.session.currentUser = { 'authenticated': true, 'userName': userData.displayName }
      res.redirect( '/content' )
    }
  } else {
    res.redirect( '/' )
  }
})

app.get( '/content', ( req, res )=>{
  util.log( util.inspect( req.session.currentUser ))
  res.render( 'content', { title: 'Content' } )
})



/* --- server start --- */
app.listen( port, () => console.log( `Example app listening on port ${port}!` ))
