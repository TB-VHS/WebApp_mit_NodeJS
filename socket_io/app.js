'use strict'

require( 'dotenv' ).config()
const util    = require( 'util' )
,     path    = require( 'path' )
,     express = require( 'express' )
,     app     = express()
,     hbs     = require( 'express-handlebars' )
,     server  = require( 'http' ).Server( app )
,     io      = require( 'socket.io' )( server )

/* middleware */
app.use( express.static( path.join( __dirname, '/public' )))

/* set view engine and map views directory */
app.set( 'views', path.join( __dirname, 'views' ))
app.engine( 'handlebars', hbs() )
app.set( 'view engine', 'handlebars' )

/* route */
app.get( '/', ( req, res )=>{
  res.render( 'chat', { layout: false, ioSocket: process.env.CHAT_IO_SOCKET })
})

/* socket.io server event handler */
io.on( 'connection', socket =>{
  util.log( `User connected. IP: ${ getIp( socket )}` );

/* socket.io message event handler */
  socket.on( 'chat_message', function( msg ){
    var datetime  = new Date().toLocaleString()
    ,   ip        = getIp( socket ).split( ':' )[ 3 ]

    util.log( `Received message at ${ datetime } from ${ ip }:\n${ msg }` )

    /* send message to all connected clients */
    io.emit( 'chat_message', { msg: msg, datetime: datetime, ip: ip })
  });


  socket.on( 'disconnect', ()=>{
    util.log( 'user disconnected' )
  })
})

/* start server */
server.listen( process.env.CHAT_PORT, ()=> util.log( `listening on port ${ process.env.CHAT_PORT }` ))

/* helpers */
function getIp( socket ){
  return socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress || socket.conn.remoteAddress || socket.request.connection.remoteAddress
}
