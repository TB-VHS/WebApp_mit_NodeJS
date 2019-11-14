'use strict'

const util    = require( 'util' )
,     sqlite3 = require( 'sqlite3' ).verbose()

,     conf = { dbName: 'projectDB', tableName: 'users' }

// rowFields: firstName, lastName, password, skill, born
var data  = { users: [
              [ 'Brendan',  'Eich',       'var',      'Javascript', '1961-07-04' ]
            , [ 'Douglas',  'Crockford',  'key:val',  'JSON',       '1955' ]
            , [ 'Ryan',     'Dahl',       'require',  'Node.js',    '1981' ]
            , [ 'Isaac',    'Schlueter',  'install',  'Node.js',    null ]
            , [ 'John',     'Resig',      '$.',       'jQuery',     '1984-05-08' ]
            , [ 'Guido',    'van Rossum', 'PEP',      'Python',     '1956-01-31' ]
          ]}
let db = new sqlite3.Database( `./db/${ conf.dbName }.db` )

data.users.forEach(( user )=>{
  console.log( user )
  db.run( `INSERT INTO ${ conf.tableName }( firstName, lastName, password, skill, born ) VALUES ( ?, ?, ?, ?, ? )`
        , user
        , function( err ){
            if( err ){ return console.log( err.message )}
// get the last inserted id
            util.log( `A row has been inserted with rowid ${ this.lastID }` )
          })
})

db.close()
