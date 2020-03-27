const express = require('express')
const EventsService = require('./events-service')
const { requireAuth } = require('../middleware/jwt-auth')

const eventsRouter = express.Router()
const jsonBodyParser = express.json()

eventsRouter
  .route('/')
  .get((req, res, next) => {
    EventsService.getAllEvents(req.app.get('db'))
      .then(events => {
        res.json(events.map(EventsService.serializeEvent))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { concert, date, notes } = req.body
    EventsService.insertEvent(req.app.get('db'),
    { artist:concert, date, notes })
    .then(event=>res.json(event))
  })


eventsRouter
  .route('/:event_id')
  .all(requireAuth)
  .all(checkEventExists)
  .get((req, res) => {
    res.json(EventsService.serializeEvent(res.event))
  })

  .delete((req, res) => {
  EventsService.deleteEvent(req.app.get('db'),
  req.params.event_id)
  .then(data => res.send('The event was deleted'))
  })

eventsRouter.route('/:event_id/comments/')
  .all(requireAuth)
  .all(checkEventExists)
  .get((req, res, next) => {
    EventsService.getCommentsForEvent(
      req.app.get('db'),
      req.params.event_id
    )
      .then(comments => {
        res.json(comments.map(EventsService.serializeEventComment))
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkEventExists(req, res, next) {
  try {
    const event = await EventsService.getById(
      req.app.get('db'),
      req.params.event_id
    )

    if (!event)
      return res.status(404).json({
        error: `Event doesn't exist`
      })

    res.event = event
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = eventsRouter
