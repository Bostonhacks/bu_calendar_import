var express = require('express')
var router = express.Router()
var authenticate = require('./authenticate.js')
var insert = require('./insert.js')
var clean = require('./clean.js')
var debug = require('debug')('index')

router.get('/', function (req, res, next) {
  return res.render('index', { title: 'BU Schedule to Google Calendar Import', subtitle: 'Use this tool to create a google calendar from your BU class schedule.' })
})

router.get('/new_bu_calendar/', function (req, res, next) {
  return res.render('new_bu_calendar', {
    title: 'Enter schedule URL below',
    instruction: 'Go to the StudentLink and click Current Schedule. Sign in. RIGHT CLICK ON THE GRAPH and select "Copy Image URL". Paste Below.',
    name: 'Enter the name of your calendar here: '
  })
})

router.get('/classes/', function (req, res, next) {
  insert.insertCalendar(req.query.name, req.query, function (err, calId) {
    if (err) {
      return res.redirect('/error')
    } else {
      debug('Inserted complete. Cleaning cal')
      clean.cleanUp(calId, function (err) {
        if (err) {
          return res.redirect('/error')
        } else {
          return res.redirect('/end')
        }
      })
    }
  })
})

router.get('/google/auth/', function (req, res) {
  return authenticate.getAccessToken(res)
})

router.get('/google/authcomplete/', function (req, res) {
  return authenticate.setToken(req.query.code, res)
})

router.get('/instructions', function (req, res) {
  return res.render('instructions')
})

router.get('/end', function (req, res, next) {
  return res.render('end')
})

module.exports = router
