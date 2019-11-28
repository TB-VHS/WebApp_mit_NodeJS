'use strict'

const util = require( 'util' )
const calendar = require( 'node-calendar' )
const _ = require( 'lodash' )


function kalenderMonat( year, month, verbose=false ){
  var cal = new calendar.Calendar( 0 ).monthdayscalendar( year, month )
  if( verbose ) util.log( '----- monthdayscalendar -----' )
  if( verbose ) util.log( cal )
  if( verbose ) util.log( '----- flatten -----' )
  cal = _.flatten( cal )
  if( verbose ) util.log( cal )
  if( verbose ) util.log( '----- map in object -----' )
  cal = cal.map( function( dayNumber ){
    var calDay = new Date( nowYear, nowMonth - 1, dayNumber )
    ,   calTag = calDay.toLocaleDateString( 'de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    ,   calArr = calTag.split( ' ' )

    return  {
              epoche:    calDay.getTime()
            , calTag:   ( dayNumber === 0 ) ? null :  { wochentag:  _.trimEnd(calArr[ 0 ], ',' )
                                                      , tageszahl:  _.trimEnd(calArr[ 1 ], '.' )
                                                      , monatsname: calArr[ 2 ]
                                                      , jahreszahl: calArr[ 3 ]
                                                      }
            }
  })
  if( verbose ) util.log( cal )
  if( verbose ) util.log( '----- done -----' )

  return cal
}


var now = new Date()
util.log( 'now:', util.inspect( now ))

var nowMonth = now.getMonth() + 1
util.log( 'nowMonth:',  nowMonth )

var nowYear = now.getFullYear()
util.log( 'nowYear:',  nowYear )

// var monat = kalenderMonat( nowYear, nowMonth, true )
var monat = kalenderMonat( nowYear, nowMonth, false )
util.log( 'return value of kalenderMonat:', util.inspect( monat ))


