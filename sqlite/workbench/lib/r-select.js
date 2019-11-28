'use strict'

const util    = require( 'util' )
,     sqlite3 = require( 'sqlite3' ).verbose()

,     conf = { dbName: 'callipro', tableName: 'dates' }

let db = new sqlite3.Database( `./db/${ conf.dbName }.db`, sqlite3.OPEN_READWRITE, ( err )=>{
  if( err ){ console.error( err.message )}
  console.log( `Connected to the ${ conf.dbName } database.` )
})


db.serialize(()=>{
  db.each( `SELECT * FROM ${ conf.tableName }`, ( err, row )=>{
    if( err ){ console.error( err.message )}
// Datensatz verarbeiten --->
    util.log( `row ${ row.id }: ${ util.inspect( row )}` )

// <---
  })
})

db.close()
