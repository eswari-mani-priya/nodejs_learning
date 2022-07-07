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
        path: '/adddata',
        handler: (request, h) => {
            return h.view('welcome.html');
        }
    },
    {
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            try {
                var book = await bookData.find({}).lean().exec();
                    // console.log(book);
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
        method: "GET",
        path: '/delete',
        handler: (request, h) => {
            const id = request.query.id;
            console.log(id);
            bookData.findByIdAndRemove(id).exec();
            return h.redirect('/bookdata');
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

