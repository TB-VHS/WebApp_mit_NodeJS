'use strict'

const util    = require( 'util' )
,     sqlite3 = require( 'sqlite3' ).verbose()

,     conf = { dbName: 'callipro', tableName: 'dates' }

// rowFields:

// id
// year
// month
// day
// hour
// minute
// subject
// created_at
// created_by

var dt1 = new Date( 2019, 11, 5, 19, 30 )
var dt2 = new Date( 2019, 11, 17, 12, 0 )
var dt3 = new Date( 2019, 11, 28, 6, 0 )

var data  = { dates: [
              [ dt1.getTime(), '2019', '11', '5', '19', '30', 'WebApplikationen mit NodeJS - letzte Session', Date.now(), 1 ]
            , [ dt2.getTime(), '2019', '11', '17', '12', '0', 'Wrights first flights - 116 Jahre', Date.now(), 1 ]
            , [ dt3.getTime(), '2019', '11', '28', '6', '0', 'San Innocente - Obacht!', Date.now(), 1 ]
            ]}
let db = new sqlite3.Database( `./db/${ conf.dbName }.db` )

data.dates.forEach(( date )=>{
  console.log( date )
  db.run( `INSERT INTO ${ conf.tableName }( id, year, month, day, hour, minute, subject, created_at, created_by ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )`
        , date
        , function( err ){
            if( err ){ return console.log( err.message )}
// get the last inserted id
            util.log( `A row has been inserted with rowid ${ this.lastID }` )
          })
})

db.close()
