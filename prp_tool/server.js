'use strict';

const Hapi = require('@hapi/hapi');

const init = async() => {
    const server = Hapi.Server({
        host: 'localhost',
        port: 1234
    });
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return "<h1>Hello World!</h1";
        }
    });

    server.route({
        method: 'GET',
        path: '/users/{user?}',
        handler: (request, h) => {
            if (request.params.user) {
                return `<h1>Hello ${request.params.user}</h1>`;
            }else {
                return "<h1>Hello Stranger!</h1>"
            }
            
        }
    });

    await server.start();
    console.log(`Server started on: ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

init();

