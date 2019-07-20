	"use strict";
const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.Server(app);
const io = require('socket.io')(httpServer);
const ss = require('socket.io-stream');
const fs = require('fs');
const uuidv1 = require('uuid/v1');
//const zlib = require('zlib');

const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: "",
    secretAccessKey: ""
});

const s3Stream = require('s3-upload-stream')(new AWS.S3());

app.get('/', (req, res, next) => {
	return res.sendFile(__dirname + '/client/index.html');
});

app.get('/app.js', (req, res, next) => {
	return res.sendFile(__dirname + '/client/app.js');
});

app.get('/socket.io.js', (req, res, next) => {
	return res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

app.get('/socket.io-stream.js', (req, res, next) => {
	return res.sendFile(__dirname + '/node_modules/socket.io-stream/socket.io-stream.js');
});

io.of('/user').on('connection', function(socket) {

	console.log("connection");
  
	ss(socket).on('send-file', function(stream, file) {

			let upload = s3Stream.upload(
				{
					Bucket: "",
					Key: 'test_'+(function(){return uuidv1()})()+'.jpg',
				}
			);
	
			upload.on('error', function (error) {
				console.log(error);
			  });
	
			upload.on('uploaded', function (details) {
				console.log(details);
			});
	
			stream.pipe(upload);
	});
  });

httpServer.listen(4486, () => {
	console.log('Server listening on port 4486');
});