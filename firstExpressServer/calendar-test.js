'use strict'

const util = require( 'util' )
const calendar = require( 'node-calendar' )




var now = new Date()
util.log( 'now:', util.inspect( now ))

var nowMonth = now.getMonth() + 1
util.log( 'nowMonth:',  nowMonth )

var nowYear = now.getFullYear()
util.log( 'nowYear:',  nowYear )

var cal = new calendar.Calendar( 0 ).monthdayscalendar( nowYear, nowMonth )
cal = cal.flat()
util.log( cal )
