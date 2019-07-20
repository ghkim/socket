$(document).ready(function () {

	$(function () {

		var socket = io.connect('http://localhost:4486/user');

		socket.on("connect", function () {
			console.log("on connect");
		})

		$('#file').change(function (e) {

			console.log('uploading...', file)

			var files = e.target.files;

			for (var i = 0; i < files.length; i++) {

				(function (index) {
					setTimeout(function () {
						var file = files[index];
						var stream = ss.createStream({
							highWaterMark: 1024000,
							objectMode: true,
							allowHalfOpen: true
						});

						var blobStream = ss.createBlobReadStream(file);

						// progress call back
						blobStream.on('data', function (chunk) {
							console.log(file.name + '_data chunk.length:', chunk.length);
						});

						// end call back
						blobStream.on('end', function () {
							console.log(index + '_end');
						});

						ss(socket).emit('send-file', stream, file);

						blobStream.pipe(stream);
					}, 10);
				})(i)
			}
		});
	});
});