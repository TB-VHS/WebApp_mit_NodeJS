'use strict'

const path = require( 'path' )

const express = require( 'express' )

const app = express()
const hbs = require('express-handlebars')
const port = 3000

var userData = require( './lib/user_data' )

/* --- middleware --- */
app.use( express.static( path.join( __dirname, 'public' )))

app.engine('handlebars', hbs())
app.set('view engine', 'handlebars')


/* --- routes --- */
app.get( '/', ( req, res )=>{
  res.send( 'Hello World!' )
})

app.get( '/user', ( req, res )=>{
  res.render( 'user', { title: 'User', user: userData })
})


/* --- server start --- */
app.listen( port, () => console.log( `Example app listening on port ${port}!` ))
