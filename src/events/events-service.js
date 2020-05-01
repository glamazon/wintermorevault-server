const xss = require('xss');

const EventsService = {
	getAllEvents(db) {
		return db.from('wintermorevault_events AS art').select('art.id', 'art.artist', 'art.date', 'art.notes');
	},

	getById(db, id) {
		return EventsService.getAllEvents(db).where('art.id', id).first();
	},
	deleteEvent(db, id) {
		return db('wintermorevault_events').where({ id }).del();
	},
	getCommentsForEvent(db, event_id) {
		return db
			.from('wintermorevault_comments AS comm')
			.select(
				'comm.id',
				'comm.text',
				'comm.date',
				db.raw(
					`json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.user_name,
                  usr.full_name,
                  usr.nickname,
                  usr.date,
                  usr.date_modified
              ) tmp)
            )
          ) AS "user"`
				)
			)
			.where('comm.event_id', event_id)
			.leftJoin('users AS usr', 'comm.user_id', 'usr.id')
			.groupBy('comm.id', 'usr.id');
	},

	insertEvent(db, newEvent) {
		return db.insert(newEvent).into('wintermorevault_events').returning('*').then(([ user ]) => user);
	},

	serializeEvent(event) {
		const { author } = event;
		return {
			id: event.id,
			artist: xss(event.artist),
			date: new Date(event.date),
		notes: xss(event.notes)
		};
	},

	serializeEventComment(comment) {
		const { user } = comment;
		return {
			id: comment.id,
			event_id: comment.event_id,
			text: xss(comment.text),
			date: new Date(comment.date),
			user: {
				id: user.id,
				user_name: user.user_name,
				full_name: user.full_name,
				nickname: user.nickname,
				date: new Date(user.date),
				date_modified: new Date(user.date_modified) || null
			}
		};
	}
};

module.exports = EventsService;
