'use strict'

const sqlite3 = require( 'sqlite3' ).verbose()

,     conf = { dbName: 'projectDB', tableName: 'users' }

let db = new sqlite3.Database( `./db/${ conf.dbName }.db` )


db.run( `CREATE TABLE IF NOT EXISTS ${ conf.tableName }(\
          id INTEGER PRIMARY KEY AUTOINCREMENT\
        , lastName text\
        , firstName text\
        , password text\
        , skill text\
        , born text\
        )` )

db.close()
