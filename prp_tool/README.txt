Hapi  is short form of HTTP API server developed by Walmart labs
Steps to create a simple CRUD application
1. Define our Node packages start our server using Hapi
$ npm init # creates package.json
create  server.js
$ npm install @hapi/hapi
->'use strict'; - Strict mode prevents certain actions from being taken(accidentally creating global variable) and throws exceptions
-> define const init which is an async function.
-> get the server from Hapi.Server by providing host and port
-> now add routes as you wish by providing method, path and handler data
2. Define model(s)
3. Register plugins
-> Plugin is additional functionality added to your app.
-> Installed hapi-geo-locate
-> to serve static files installing @hapi/inert
-> to show dynamic files installing @hapi/vision
-> Now install templating engine - handlebars

4. Declare routes using Hapi
5. Document and Dry run using Hapi Swagger

