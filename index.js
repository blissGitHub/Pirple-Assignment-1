// The Assignment:
//
// Please create a simple "Hello World" API. Meaning:
//
// 1. It should be a RESTful JSON API that listens on a port of your choice.
//
// 2. When someone posts anything to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want.

console.log('index.js')
var http = require('http');
//var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');


var httpServer = http.createServer(function(req, res){

  console.log('inside createServer')
  // console.log('req', req)
  // console.log('res', res)

  unifiedServer(req, res);

});

httpServer.listen(config.httpPort, function(){
  console.log('The HTTP server is running on port ' + config.httpPort);

});

// All the server loic for both the http and https server
var unifiedServer = function(req, res){
  // Pare the url

  var parsedUrl = url.parse(req.url, true);

  console.log('parsedUrl', parsedUrl);

  //Get the path
  var path = parsedUrl.pathname;

  console.log('path', path);

  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  console.log('trimmedPath', trimmedPath);

  //Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();
  console.log('method', method);

  //Get the headers as an object
  var headers = req.headers;
  console.log('headers', headers);

  //Get the payload, if any

  var decoder = new StringDecoder('utf-8');

  var buffer = '';
  req.on('data', function(data) {
      console.log('inside on');
      buffer += decoder.write(data);
  });

  req.on('end', function(){
    buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    // var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;


    var chosenHandler = function(data, callback){

      if(data.trimmedPath === 'hello'){
        callback(406, {'message': 'Hello World'});
      }else{
        callback(404);
      }


    };


    // Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data,function(statusCode,payload){

      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof(payload) == 'object'? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning this response: ",statusCode,payloadString);

    });


  })



}
