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
        'ListEvents': {
            url: '/ListEvents.json',
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
        'ListEvents': {
            url: '/ListEvents.json',
            method: 'get'
        }
    }
}