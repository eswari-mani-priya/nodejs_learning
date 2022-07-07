'use strict';

const Hapi = require('@hapi/hapi');
const path = require('path');
const Mongoose = require('mongoose');
const Joi = require('joi');
const { url } = require('inspector');

Mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });
let Schema = Mongoose.Schema;
let bookDataSchema = new Schema ({
    title: String,
    image: String,
    file: String
});

let bookData = Mongoose.model('BookData', bookDataSchema);


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
            return h.view('welcome.html');
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
        path: '/bookdata',
        handler: async (request, h) => {
            try {
                var book = await bookData.find({}).lean().exec();
                    return h.view('index.html', {data: book});
            } catch(error) {
                return h.response(error).code(500);
            }   
        }
    },
    {
        method: 'POST',
        path: '/book',
        handler: (request, h) => {
            try {
            const book = {
                title: request.payload.title,
                image: request.payload.image,
                file: request.payload.book_file
            }
            var data = new bookData(book);
            data.save();
            console.log(data);
            return h.redirect('/');
        } catch(error) {
            return h.response(error).code(500);
        }
        }
    },
    {
        method: 'GET',
        path: '/LearningPython.pdf',
        handler: (request, h) => {
            return h.file('LearningPython.pdf');
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

