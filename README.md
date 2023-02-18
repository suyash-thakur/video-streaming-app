# Video Stream App
This is a simple video streaming app built with Node.js, Express, and Media Source Extensions (MSE) for the front-end. The app allows the user to stream a video from the server with the ability to seek and pause/resume the video.

## Backend
The backend of the app is built with Node.js and Express. The server serves a static HTML file and a video file. The video file is streamed to the client using range requests. This allows the client to request specific parts of the video, which is useful for seeking and resuming playback.

When the client requests the video, the server checks if the request includes a range header. If the range header exists, the server reads the requested bytes from the file and sends them to the client with the appropriate headers. If the range header does not exist, the server sends the entire file to the client.

The back-end code is located in the `index.js` file.

`GET /ping`
This endpoint can be used to check if the server is running. It returns a `pong !!` message.

`GET /video`
This is the main endpoint that streams the video file to the client. It supports partial content requests for efficient streaming. The video file is served from the video.mp4 file in the project directory.

`GET /`
This endpoint serves the index.html file that contains the HTML and JavaScript code for the web client.

## Frontend
The frontend of the app is built with HTML, CSS, and JavaScript. The app uses the Media Source Extensions API to stream the video from the server.

The video player is created using the `<video>` tag in HTML. When the page loads, the video source is set to an empty MediaSource object.

When the MediaSource object is opened, the app creates a source buffer with the appropriate MIME type and codec. The app then loads the first chunk of the video from the server and appends it to the source buffer.

The app listens for the `timeupdate` event on the video player. When this event is triggered, the app checks if the remaining video time is less than the chunk size. If it is, the app loads the next chunk from the server and appends it to the source buffer.

The front-end code is located in the `index.html` file.

Getting started
Clone this repository: git clone https://github.com/suyash-thakur/video-stream-app.git
Install dependencies: npm install
Start the server: npm start
Open http://localhost:8080 in your web browser to view the app.
