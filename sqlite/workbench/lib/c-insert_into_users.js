'use strict'

const util    = require( 'util' )
,     sqlite3 = require( 'sqlite3' ).verbose()

,     conf = { dbName: 'callipro', tableName: 'users' }

// rowFields:
// lastName text
// firstName text
// displayName
// email
// password text
// role text
// created_at integer
// last_login integer
// last_logout integer
var data  = { users: [
              [ 'Müller', 'Thomas', 'Thommy89', 'tm@bm.test', 'pw123',  'admin', Date.now() ]
          ]}
let db = new sqlite3.Database( `./db/${ conf.dbName }.db` )

data.users.forEach(( user )=>{
  console.log( user )
  db.run( `INSERT INTO ${ conf.tableName }( lastName, firstName, displayName, email, password, role, created_at ) VALUES ( ?, ?, ?, ?, ?, ?, ? )`
        , user
        , function( err ){
            if( err ){ return console.log( err.message )}
// get the last inserted id
            util.log( `A row has been inserted with rowid ${ this.lastID }` )
          })
})

db.close()
