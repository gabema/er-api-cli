const reduce = require('lodash.reduce');
const {addFunction} = require('../parser');
const {getEvents, getEventsPeoples, getEvent, getEventPeoples} = require('@ercorp/er-api-js/apiv2/events');
const columnify = require('columnify');

const addV2EventFunctions = () => {
    addFunction({
        command: 'v2Events',
        cmdRegEx: /^(.*)$/,
        description: 'Gets a list of Events. Uses the optional format search|offset|limit|filter|order' +
                'by|rowVersionDefaults to 5 events.',
        cb: params => {
            const splitParams = (params[1] || '').split('|');
            let queryParams = {};
            if (splitParams[0]) {
                queryParams.search = splitParams[0];
            }
            if (splitParams[1]) {
                queryParams.offset = splitParams[1];
            }
            queryParams.limit = parseInt(splitParams[2] || '5', 10);

            if (splitParams[3]) {
                queryParams.filter = splitParams[3];
            }
            if (splitParams[4]) {
                queryParams.orderby = splitParams[4];
            }
            if (splitParams[5]) {
                queryParams.rowVersion = splitParams[5];
            }

            return getEvents(queryParams).then(data => {
                if (data.events) {
                    const eventSummaries = reduce(data.events, (acc, {eventsID, eventDate, eventEndDate, eventName, rowVersion}) => {
                        acc.push({eventsID, eventDate, eventEndDate, eventName, rowVersion});
                        return acc;
                    }, []);
                    console.log(columnify(eventSummaries));
                } else {
                    console.log('No Events returned.');
                };
            });
        }
    });
    addFunction({
        command: 'v2EventsPeoples',
        cmdRegEx: /^(.*)$/,
        description: 'Gets a list of People for events. Uses the optional format offset|limit|filter|o' +
                'rderby|rowVersionDefaults. Defaults to 5 event people.',
        cb: params => {
            const splitParams = (params[1] || '').split('|');
            let queryParams = {};
            if (splitParams[0]) {
                queryParams.offset = splitParams[0];
            }
            queryParams.limit = parseInt(splitParams[1] || '5', 10);

            if (splitParams[2]) {
                queryParams.filter = splitParams[2];
            }
            if (splitParams[3]) {
                queryParams.orderby = splitParams[3];
            }
            if (splitParams[4]) {
                queryParams.rowVersion = splitParams[4];
            }

            return getEventsPeoples(queryParams).then(data => {
                if (data.eventPeople) {
                    const eventPeoples = reduce(data.eventPeople, (acc, {
                        eventID,
                        eventPersonID,
                        userID,
                        firstName,
                        lastName,
                        rowVersion
                    }) => {
                        acc.push({
                            eventID,
                            eventPersonID,
                            userID,
                            firstName,
                            lastName,
                            rowVersion
                        });
                        return acc;
                    }, []);
                    console.log(columnify(eventPeoples));
                } else {
                    console.log('No Events Peoples returned.');
                };
            });
        }
    });
    addFunction({
        command: 'v2Event',
        cmdRegEx: /^(\d+)$/,
        description: 'Gets an event by event id. Can optionally include rowVersion.',
        cb: params => {
            const eventId = parseInt(params[1], 10);
            return getEvent(eventId).then(data => {
                if (data.event) {
                    console.log(columnify(data.event));
                } else {
                    console.log('No event info');
                }
                return data;
            });
        }
    });
    addFunction({
        command: 'v2EventPeoples',
        cmdRegEx: /^(\d+)$/,
        description: 'Gets the people attending an event by event id.',
        cb: params => {
            const eventId = parseInt(params[1], 10);
            return getEventPeoples(eventId).then(data => {
                if (data.eventPeople) {
                    const eventPeoples = reduce(data.eventPeople, (acc, {
                        eventPersonID,
                        userID,
                        firstName,
                        lastName,
                        hours,
                        points,
                        rowVersion
                    }) => {
                        acc.push({
                            eventPersonID,
                            userID,
                            firstName,
                            lastName,
                            hours,
                            points,
                            rowVersion
                        });
                        return acc;
                    }, []);
                    console.log(columnify(eventPeoples));
                } else {
                    console.log('No Events Peoples returned.');
                };
                return data;
            });
        }
    });
};

module.exports = {
    addV2EventFunctions
};