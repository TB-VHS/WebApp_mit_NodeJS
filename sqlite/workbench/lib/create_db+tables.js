'use strict'

const sqlite3 = require( 'sqlite3' ).verbose()

,     conf = { dbName: 'callipro', tableName: 'users' }

let db = new sqlite3.Database( `./db/${ conf.dbName }.db` )


db.run( `CREATE TABLE IF NOT EXISTS ${ conf.tableName }(\
          id INTEGER PRIMARY KEY AUTOINCREMENT\
        , lastName text\
        , firstName text\
        , displayName text\
        , email text\
        , password text\
        , role text\
        , created_at integer\
        , last_login integer\
        , last_logout integer\
        )` )

db.close()
