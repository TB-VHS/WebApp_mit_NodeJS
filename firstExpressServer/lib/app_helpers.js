'use strict'

const util = require( 'util' )
const calendar = require( 'node-calendar' )
const _ = require( 'lodash' )


module.exports = {

  kalenderMonat:  ( year, month, verbose=false )=>{
                    var cal = new calendar.Calendar( 0 ).monthdayscalendar( year, month )
                    if( verbose ) util.log( '----- monthdayscalendar -----' )
                    if( verbose ) util.log( cal )
                    if( verbose ) util.log( '----- flatten -----' )
                    cal = _.flatten( cal )
                    if( verbose ) util.log( cal )
                    if( verbose ) util.log( '----- map in object -----' )
                    cal = cal.map( function( dayNumber ){
                      var calDay = new Date( year, month - 1, dayNumber )
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

}
