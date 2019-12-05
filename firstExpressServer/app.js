'use strict'

const path = require( 'path' )
const util = require( 'util' )

const express = require( 'express' )
const sqlite3 = require( 'sqlite3' ).verbose()

const app = express()
const hbs = require('express-handlebars')
const bodyParser = require( 'body-parser' )
var session = require( 'express-session' )

const _ = require( 'lodash' )

const port = 3000
,     conf = { dbName: 'callipro' }
// require( 'dotenv' ).config()


var helpers = require( './lib/app_helpers' )

/* --- middleware --- */
app.use( express.static( path.join( __dirname, 'public' )))

app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({ extended: true }))

app.engine('handlebars', hbs({
  helpers: {
    weekOpen: function( d ){ return ( d % 7 === 0 ) ? '<div class="row">' : '' }
  , weekClose: function( d ){ return ( ( 1 + d ) % 7 === 0 ) ? '</div>' : '' }
  , weekdayColor: function( d ){
      var color = '';
      switch( d % 7 ){
        case 5: color += 'amber-text text-darken-2 grey lighten-5'; break;
        case 6: color += 'red-text grey lighten-5'; break;
        default: color += 'blue-text grey lighten-5';
      }
      return color;
    }
  }
}))
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

app.get( '/logout', ( req, res )=>{
  req.session.destroy(( err )=>{
    if( err ){ console.error( err.message )}
    res.redirect( '/login' )
  })
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
    // util.log( `allRows: ${ util.inspect( allRows )}` )
    res.render( 'kalender'
              , { title:        'callipro'
                , monatJetzt:   monatJetzt
                , displayName:  req.session.currentUser.displayName
                , kalenderTage: helpers.kalenderMonat( dateNow.getFullYear(), dateNow.getMonth() + 1, allRows, true )
                })
  })

})

app.post( '/kalender_tag', ( req, res )=>{
  util.log( 'ACTION:', req.body.action )
  var db = new sqlite3.Database( `./db/${ conf.dbName }.db`, sqlite3.OPEN_READWRITE, ( err )=>{
    if( err ){ console.error( err.message )}
    console.log( `Connected to the ${ conf.dbName } database.` )
  })
  switch( req.body.action ){

    case 'retrieve':
      var datumArr = req.body.datum.split( '-' )
      ,   datum = { 
                    tageszahl:   datumArr[ 2 ]
                  , monatszahl:  datumArr[ 1 ] - 1
                  , jahreszahl:  datumArr[ 0 ]
                  , iso8601:     req.body.datum
                  }
      db.all( `SELECT * FROM dates WHERE year='${ datum.jahreszahl }' AND month='${ _.trimStart( datum.monatszahl, '0' )}' AND day='${ _.trimStart( datum.tageszahl, '0' )}'`, ( err, allRows )=>{
        if( err ){ console.error( err.message )}
    // Datensatz verarbeiten --->
    util.log( 'DATUM:', util.inspect( datum ))
    util.log( `allRows_kalender_tag: ${ util.inspect( allRows )}` )
        res.render( 'kalender_tag'
                  , { title:   ( new Date( datum.iso8601.split( '-' ))).toLocaleDateString( 'de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                    , dates:   allRows
                    })
      })
      break
   
    case 'create':
      db.run( `INSERT INTO ${ conf.tableName }( id, year, month, day, hour, minute, subject, created_at, created_by ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )`
            , req.body.date
            , function( err ){
                if( err ){ return console.log( err.message )}
        // get the last inserted id
                util.log( `A row has been inserted with rowid ${ this.lastID }` )
              })
      break

    default:
      util.log( 'not supported action:', req.body.action )
  }

  db.close()
})
/* --- server start --- */
app.listen( port, () => console.log( `Example app listening on port ${ port }!` ))
