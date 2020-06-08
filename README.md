# SongsWithFriends

## How to use

1. Login <br />
	There are two kinds of login, one for user who have valid Spotify account and one for user who doesn't have a Spotify account. <br />
	* Spotify Login: <br />
		User will be redirect to spotify to sign in and authorize so that the app can grab user's library and get the auth token to preform action on user's behalf. <br />
	* Guest Login: <br />
		User will not need to actually login to Spotify but will still be able to serach for song and add songs to the queue. Note that in this mode the user will not be able to host a room and can only join other existing room. <br />

2. Create / Join Room <br />
	After successful login, user will be redirected to a page where the user could either choose to create a new room and be the host, or join other exsiting room. Guest will only be able to join exisitng room. <br />
	One thing to be aware of is that **plase make sure you check the `Devices` button on the top right and make sure you have a active device presenting.** To identify a active device, you device name will have a `(Active)` postfix. If no device were showing, please click the refresh button until your device pops up and is active. <br />
	One way to make sure your device is active is to close and reopen Spotify app on your device and start playing a song. After that just click the refresh button in the popup and you should be able to see your device. <br />
	Also, currently the Spotify Web API does not support its own web player well enough, so we do not recommand user using Spotify web player to be the main playback device for SongWithFriends. <br />

3. Room Actions * Destroy Room <br />
	There are several room actions user can preform: <br />
	* Devices <br />
		User can click on the `Devices` button to check which user device is active and is used as the current playback device. <br />
	* Invite <br />
		User can click on the `Invite` button to get the room ID and share it to friends so other user can use that code to join this room, either as a logged in user or as a guest.
	* Destroy Room <br />
		Only host of this room will have this option. If the host decides to destory the room, the queue will be destroy and everyone in the room will be logged out. <br />
	* Leave Room <br />
		Only guest will have this option. If the guest decides to leave the room, he/she will simply leave the room and nothing will happen to the room. But the user will be able to join again or join another room.
	* Log Out <br />
		User can click on the `Log Out` button to log out. If host decides to log out, the room will be destroy. If a guest logs out, he/she will simply be logged out, nothing will happen to the room. <br />

4. Add Songs to Queue <br />





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
