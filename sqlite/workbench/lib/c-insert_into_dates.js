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

var dt = new Date( 2019, 10, 30, 15, 0 )

var data  = { dates: [
              [ dt.getTime(), '2019', '10', '30', '15', '0', 'Adventsbazar', Date.now(), 1 ]
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
