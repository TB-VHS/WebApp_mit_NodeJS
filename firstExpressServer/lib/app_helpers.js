'use strict'

const util = require( 'util' )
const calendar = require( 'node-calendar' )
const _ = require( 'lodash' )


module.exports = {

  kalenderMonat:  ( year, month, datesRows, verbose=false )=>{
                    var cal = new calendar.Calendar( 0 ).monthdayscalendar( year, month )
                    if( verbose ) util.log( '----- monthdayscalendar -----' )
                    if( verbose ) util.log( cal )
                    if( verbose ) util.log( '----- flatten -----' )
                    cal = _.flatten( cal )
                    if( verbose ) util.log( cal )
                    if( verbose ) util.log( '----- map in object -----' )
                    cal = cal.map( function( dayNumber ){
                      var calDate   = new Date( year, month - 1, dayNumber, 3 )
                      ,   calTag    = calDate.toLocaleDateString( 'de-DE', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
                      ,   calArr    = calTag.split( ' ' )

                      var   dates     = []
                      datesRows.forEach(( row ) => {
                        if( parseInt( row.day ) === dayNumber ){
                          dates.push({  epoche:   row.id
                                      , hour:     _.padStart( row.hour, 2, '0' )
                                      , minute:   _.padStart( row.minute, 2, '0' )
                                      , subject:  row.subject
                                      })
                        }
                      })

                      return  {
                                epoche:   calDate.getTime()
                              , calTag:   ( dayNumber === 0 ) ? null :  { wochentag:  _.trimEnd(calArr[ 0 ], '.,' )
                                                                        , tageszahl:  _.trimEnd(calArr[ 1 ], '.' )
                                                                        , monatsname: calArr[ 2 ]
                                                                        , jahreszahl: calArr[ 3 ]
                                                                        }
                              , dates:    ( dates.length > 0 ) ? dates : null
                              }
                    })
                    if( verbose ) util.log(util.inspect( cal, false, null ))
                    if( verbose ) util.log( '----- done -----' )

                    return cal
                  }

}
