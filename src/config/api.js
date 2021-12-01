export var apiList = {
    "development": {
        'login': {
            url: '/Login.json',
            method: 'get'
        },
        'register': {
            url: '/Register.json',
            method: 'get'
        },
        'listEvents': {
            url: '/ListEvents.json',
            method: 'get'
        },
        'createEvents': {
            url: '/CreateEvent.json',
            method: 'get'
        },
        'amendEvent': {
            url: '/AmendEvent.json',
            method: 'get'
        },
        'deleteEvent': {
            url: '/DeleteEvent.json?a={a}&b={b}',
            method: 'get'
        }
    },
    "production": {
        'login': {
            url: '/Login.json',
            method: 'post'
        },
        'register': {
            url: '/Register.json',
            method: 'post'
        },
        'listEvents': {
            url: '/v1/canlander-event',
            method: 'get'
        },
        'createEvents': {
            url: 'v1/canlander-event',
            method: 'post'
        },
        'amendEvent': {
            url: 'v1/canlander-event/{eventId}',
            method: 'put'
        },
        'deleteEvent': {
            url: 'v1/canlander-event/{eventId}',
            method: 'delete'
        }
    }
}