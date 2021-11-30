export var apiList = {
    "development": {
        'eventList': {
            url: '/eventList.json',
            method: 'get'
        },
        'login': {
            url: '/login.json',
            method: 'get'
        },
        'register': {
            url: '/register.json',
            method: 'get'
        }
    },
    "production": {
        'eventList': {
            url: '/eventList.json',
            method: 'get'
        },
        'login': {
            url: '/login.json',
            method: 'post'
        },
        'register': {
            url: '/register.json',
            method: 'post'
        }
    }
}