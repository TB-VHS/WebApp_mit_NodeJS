'use strict'

const path = require( 'path' )
const util = require( 'util' )

const express = require( 'express' )
const sqlite3 = require( 'sqlite3' ).verbose()

const app = express()
const hbs = require('express-handlebars')
const bodyParser = require( 'body-parser' )
var session = require( 'express-session' )

const port = 3000
,     conf = { dbName: 'callipro', tableName: 'users' }

var helpers = require( './lib/app_helpers' )

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
  let db = new sqlite3.Database( `./db/${ conf.dbName }.db`, sqlite3.OPEN_READWRITE, ( err )=>{
    if( err ){ console.error( err.message )}
    console.log( `Connected to the ${ conf.dbName } database.` )
  })

  db.each( `SELECT * FROM users WHERE email='${ req.body.email }'`, ( err, row )=>{
    if( err ){ console.error( err.message )}
// Datensatz verarbeiten --->
    util.log( `row ${ row.id }: ${ util.inspect( row )}` )

    if( req.body.password == row.password ){
      req.session.currentUser = {
        'authenticated':  true
      , 'email':          row.email
      , 'displayName':    row.displayName
      }
      res.redirect( '/kalender' )
    } else {
      res.redirect( '/' )
    }
// <---
  })
})

app.get( '/kalender', ( req, res )=>{
  util.log( util.inspect( req.session.currentUser ))
  var dateNow     = new Date()
  ,   monatJetzt  = dateNow.toLocaleDateString( 'de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(' ')[ 2 ]


  let db = new sqlite3.Database( `./db/${ conf.dbName }.db`, sqlite3.OPEN_READWRITE, ( err )=>{
    if( err ){ console.error( err.message )}
    console.log( `Connected to the ${ conf.dbName } database.` )
  })
  db.all( `SELECT * FROM dates WHERE year='${ dateNow.getFullYear() }' AND month='${ dateNow.getMonth() }'`, ( err, allRows )=>{
    if( err ){ console.error( err.message )}
// Datensatz verarbeiten --->
    util.log( `allRows: ${ util.inspect( allRows )}` )
    res.render( 'kalender'
              , { title:        'callipro'
                , monatJetzt:   monatJetzt
                , displayName:  req.session.currentUser.displayName
                , kalenderTage: helpers.kalenderMonat( dateNow.getFullYear(), dateNow.getMonth() + 1 )
                })
  })

})


app.get

/* --- server start --- */
app.listen( port, () => console.log( `Example app listening on port ${port}!` ))
