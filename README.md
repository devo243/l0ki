### Project Log 

## Project setup reminder
- git clone link
- npm run hotloader

- To push
  - git pull origin master
  - git add .
  - git commit -m "message"
  - git push origin master

## TODO ITEMS FOR WEEK OF 1/11

- Make sure the backend of the game is working correctly
- Begin adding sockets for live multiplayer
- Add server for a game for secure gameplay
- Install Basic CSS function so the game at least looks presentable

## Meeting 1/13/2021
- Goals: Win condition / find tutorial to make the cards
- Code more rules
- Backend Todos: Server / Sockets
- Fronted Todos: Drag and drop / Front end


## TODO ITEMS IMMEDIATELY

- Go to office hours to check with TA about api stuff
- Make sure there is a win condition / lose condition (so the game doesn't crash)
- Color code stuff to make the game easier to debug

## 1/12/2021

- Create a hand for the user
- Allow user to "submit" the card they want to
- Feedback for user to see if it defied the "rules" through console.log

## 1/11/2021

- Install project framework
- Route game.js and navbar.js (css to come)
- Create a deck of cards for the user



# Project Skeleton

## What we provide

- Google Auth (Skeleton.js & auth.js)
  - Disclaimer: Auth isn't being taught until the second week.
- Socket Infrastructure (client-socket.js & server-socket.js)
  - Disclaimer: Socket isn't being taught until the second week.
- User Model (auth.js & user.js)

## What you need to change

- Change the font in utilities.css
- Change the Frontend CLIENT_ID for Google Auth (Skeleton.js) (we'll talk about it at the end of week 2)
- Change the Server CLIENT_ID for Google Auth (auth.js) (we'll talk about it at the end of week 2)
- Change the Database SRV for Atlas (server.js)
- Change the Database Name for MongoDB (server.js)
- Add a favicon to your website at the path client/dist/favicon.ico
- Update website title in client/dist/index.html
- Update this README file ;)
- Update the package.json file with your app name :) (line 2)

## Socket stuff
Note: we'll be getting to this in lecture in week 2, so don't worry if you don't know it yet

- If you're not using realtime updating or don't need server->client communication, you can remove socket entirely! (server-socket.js, client-socket.js, and anything that imports them)
- If you are using socket, consider what you want to do with the FIXME in server-socket.js


## How to integrate into your own project

On GitHub download this repository as a zip file, then extract the files into your own repository.
Warning: make sure you copy the hidden files too: .babelrc, .gitignore, .npmrc, and .prettierrc

## don't touch

the following files students do not need to edit. feel free to read them if you would like.

```
client/src/index.js
client/src/utilities.js
client/src/client-socket.js
server/validator.js
server/server-socket.js
.babelrc
.npmrc
.prettierrc
package-lock.json
webpack.config.js
```

## Good luck on your project :)
