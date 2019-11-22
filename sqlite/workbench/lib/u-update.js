'use strict'

const util    = require( 'util' )
,     sqlite3 = require( 'sqlite3' ).verbose()

,     conf = { dbName: 'projectDB', tableName: 'users' }

let db = new sqlite3.Database( `./db/${ conf.dbName }.db`, sqlite3.OPEN_READWRITE, ( err )=>{
  if( err ){ console.error( err.message )}
  console.log( `Connected to the ${ conf.dbName } database.` )
})


db.run(
  `UPDATE ${ conf.tableName } SET skill=? WHERE lastName='Schlueter'`
, [ 'npm' ]
, function( err ){
    if( err ){ return console.log( err.message )}
    console.log( `A row has been updated` )
})

db.close()
