'use strict'

const path = require( 'path' )
const util = require( 'util' )

const express = require( 'express' )

const app = express()
const hbs = require('express-handlebars')
const bodyParser = require( 'body-parser' )
const port = 3000

var userData = require( './lib/user_data' )

/* --- middleware --- */
app.use( express.static( path.join( __dirname, 'public' )))

app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({ extended: true }))

app.engine('handlebars', hbs())
app.set('view engine', 'handlebars')


/* --- routes --- */
app.get( '/', ( req, res )=>{
  res.send( 'Hello World!' )
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
  if( req.body.first_name + ' ' + req.body.last_name == userData.displayName ){
    res.redirect( '/content' )
  } else {
    res.redirect( '/' )
  }
})

app.get( '/content', ( req, res )=>{
  res.render( 'content', { title: 'Content' } )
})



/* --- server start --- */
app.listen( port, () => console.log( `Example app listening on port ${port}!` ))
