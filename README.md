# SongsWithFriends

## How to use


## Internal Details
We have a React front-end and an express/socket.io backend. 

First I'll talk about the front-end. We have layout components. These are Main and Header and they are always mounted regardless of the state of the site. Upon the user doing certain actions, they will be navigating to different pages. The logic for what those conditions are is in the Main component, the Pages themselves are in the Pages folder. There are 3, Login, Room, and Play.  The heart of the application is in Play.

The client had two ways to communicate with the server, via socketio and express. Express was used for stuff that didn't require quick and constant communication with the server. This includes (but is not limited to) authorizing the user and searching for songs. Everything that was something that needed to happen fast and real time was socketio (resuming a song, new chat message, etc). All the state that concerned the entire application was placed in the Redux store. There are 3 reducers, loadingReducer, userReducer and playbackReducer. LoadingReducer handled the state in regards to sending express requests and handling its responses. UserReducer handled the user state, (which meant the user object and the user's music library). PlaybackReducer handled the playback state. Essentially information on what is currently being played.
Other things to note about the front-end is that we used redux-thunk to support async redux actions, and we used Material UI for a couple of things that would otherwise be a pain to implement, but we generally tried to make our own components whenever possible.

If it'll help grade the client-side, here's what the component tree generally looks like:
App -> Header, Main -> A page (Room/Login/Play) -> (if play) Playlist, UserLibrary, PlayerBar, Chat

Here's a short description of all our components (which aren't pages or part of the layout).

Chat: Component for the chat

Error: Alert component which displays errors/information on the top of the screen

Loader: Spinning logo which shows when the app is loading (express endpoint call)

PlayerBar: the controls for the music

Playlist: a component for displaying the contents of a playlist. Whether the queue prop is true or not will change a lot about the functionality of this

Popup: a component used for displaying popups throughout the application

SearchOverlay: a component built using Popup which is used for displaying/implementing searching songs

Slider: a component used for playerbar to show and edit the position of the song

TrackCell: a component used by playlist to display a track

Typography: a general text component

As for the backend. We have a Routes folder which contains all the express requests. auth.js contains the authorization endpoints while music.js contains the music endpoints. users.js and rooms.js contain the globally scoped user/room objects and also the class definitions required to make those objects (as well as some helper functions). socket.js contains everything regarding sockets. Lastly, requests.js contains an abstraction of all the Spotify requests we made. Additionally, it's worth noting that we implemented the OAuth flow ourselves and did not use passport (this would be in auth.js). 

## Where to go next
See client for the React code, server for the express code, and helpers for a couple of files that were used for both
