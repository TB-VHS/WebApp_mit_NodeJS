'use strict'

const sqlite3 = require( 'sqlite3' ).verbose()

,     conf = { dbName: 'callipro', tableName: 'dates' }

let db = new sqlite3.Database( `./db/${ conf.dbName }.db` )


db.run( `CREATE TABLE IF NOT EXISTS ${ conf.tableName }(\
    id integer not null primary key\
  , year text\
  , month text\
  , day text\
  , hour text\
  , minute text\
  , subject text\
  , created_at text\
  , created_by integer\
  )` )
db.close()
