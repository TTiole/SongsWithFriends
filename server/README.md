index.js is the root of the express server, though there isn't much to see.

rooms.js contains the global rooms array, the room object definition and a couple of its helpers functions

users.js is the same as rooms.js but for users

requests.js contains all the spotify requests we will do abstracted into functions. The function at the top of that file (requestSpotify) is also the wrapper around fetch that we built for the server (much like Fetch.js)

socket.js contains everything regarding sockets. All the server event listeners and all the server emits/broadcasts.

The Routes folder contains all of our express routes. Inside it you'll find auth.js which handles the routes regarding authentication, and music.js which handles the routes regarding music. There aren't many of these and the core of the functionality is handled in socket.js
