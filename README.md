# Reader Stock

#### A MERN stack based web app for people to share weird photos from around them. Crying clowns, abandoned buildings, large wicker chairs and such. There are no restrictions and users may post whatever they want, for others to see

:boom: **View Branches Frontend and Backend** :boom:

### Technical Details
The app is built in **MERN Stack**. Technologies used are:
1. MongoDB
2. Express.js
3. React.js (with Material UI)
4. Node.js

There are two **schemas** user for the database:
1. User: {
    googleId,
    givenName,
    familyName,
    imageUrl,
    accessToken
}

2. Picture: {
    content,
    title,
    uploader
}

Both documents are stored in different collections, referencing each other through their **_id** attributes, added by MongoDB itself. 

#### Authentication
The app uses Google's **OAth2.0** Authentication API to get access to user's google account details. Once access is granted, an **access token** is used for all future interactions between the client ans the server.

### Other Details

This branch, **master** exists only to provide usage details about this project.
The **Backend** and **Frontend** branches contain the Node API and the React app respectively. If you want to run the project, clone the seperate branches and run the projects seperately. Make sure to install the dependencies before running using `yarn install` or by `npm install`.

Also make sure you have MongoDB up and running. 

#### Screenshots
:boom: Coming Soon! :boom: