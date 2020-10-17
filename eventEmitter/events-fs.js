'use strict'

/*
*
*   events-fs
*   überwacht den status ( hier erstmal nur die größe ) einer datei
*
*/

const util          = require( 'util' )
,     fs            = require( 'fs' )
,     events        = require( 'events' )
,     eventEmitter  = new events.EventEmitter()

/* event handler */
const fileSizeChanged = function fileSizeChanged( fn, fsz ){
  util.log( `Größe von ${ fn } hat sich geändert. Sie beträgt nun ${ fsz } Bytes.` )
}

/* event handler binden */
eventEmitter.on( 'file_size_changed', fileSizeChanged )

/* daten der zu überwachenden datei */
var fname     = 'lorem.txt'
,   fsize     = getFilesizeInBytes( fname )
,   fsizeNow  = fsize

/* überwachungs loop */
setInterval(
  ()=>{
    fsizeNow = getFilesizeInBytes( fname )
    if( fsizeNow !== fsize ){
      fsize = fsizeNow
      eventEmitter.emit( 'file_size_changed', fname, fsizeNow )
    }
  }
, 100 )

/* start meldung */
console.log( `Die Datei ${ fname } wird jetzt überwacht.\n[Strg + C] zum Beenden.` )


/* helpers ( mit 'function', da sonst die spätere deklaration nicht gefunden wird ) */
function getFilesizeInBytes( filename ){
  var stats = fs.statSync( filename )
  return stats[ 'size' ]
}