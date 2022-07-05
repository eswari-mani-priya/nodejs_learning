'use strict';

const Hapi = require('@hapi/hapi');
const path = require('path');

const init = async() => {
    const server = Hapi.Server({
        host: 'localhost',
        port: 1234,
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'static')
            }
        }
    });

    await server.register([{
        plugin: require("hapi-geo-locate"),
        options: {
            enabledByDefault: true
        }
    },
    {
        plugin: require('@hapi/inert'),
    },
    {
        plugin: require("@hapi/vision"),
    }
]);
    server.views({
        engines: {
            html: require('handlebars'),
        },
        path: path.join(__dirname, 'views'),
        layout: 'default'
    })
    server.route([{
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('welcome.html');
        }
    },
    {
        method: 'GET',
        path: '/download',
        handler: (request, h) => {
            return h.file('welcome.html', {
                // mode: "attachment", //downloads as attachment
                mode: "inline", //shows in same page
                filename: 'welcome-download.html'
            });
        }
    },
    {
        method: 'GET',
        path: '/users/{user?}',
        handler: (request, h) => {
            if (request.params.user) {
                return `<h1>Hello ${request.params.user}</h1>`;
            }else {
                return '<h1>Users Page</h1>'
            }
            
        }
    },
    {
        method: 'GET',
        path: '/users/user-data/',
        handler: (request, h) => {
            return `<h1>${request.query.name} works for ${request.query.technology}</h1>`
        }
    },
    {
        method: 'GET',
        path: '/location',
        handler: (request, h) => {
            if (request.location) {
                return h.view('location', {location: request.location.ip});
            }else {
                return h.view('location', {location: "Your location is not Enabled!"});
            }

            
        }
    }
]);
    server.route([{
        method: 'GET',
        path: '/dynamic',
        handler: (request, h) => {
            const data = {
                name: 'Priya'
            };
            return h.view('index.html', data);
        }
    },
    {
        method: 'POST',
        path: '/login',
        handler: (request, h) => {
            if (request.payload.username == "Priya" && request.payload.password == '1234') {
                return h.view('logged-in.html', {username: request.payload.username});
            }else{
                return h.redirect('/');
            }
        }
    }
]);

    await server.start();
    console.log(`Server started on: ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

init();

