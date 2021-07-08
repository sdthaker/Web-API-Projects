![visitors](https://visitor-badge.glitch.me/badge?page_id=sdthaker.visitor-badge)
# API Project: Exercise Tracker for FCC

## Technologies
A little bit of what's inside the project:
- **Node.js** and **Express** to create the server and handle routes, requests and responses.
- **MongoDB** and **Mongoose** to persist all the data.

## Endpoints:

Endpoints | Description | Params
----------|-------------|-------------
POST `/api/users` | Create a new user | username*, _id (via body)
GET `/api/users` | Return all registered users | n/a
POST `/api/users/:_id/exercises` | Add an exercise for a specific user & respond with a json object with all details added | userId*, description*, duration*, date (via body)
GET `/api/users/:_id/logs?[from][&to][&limit]` | Return full log of a user's exercises along with the count of exercises. The optional params, `from`, `to` & `limit` can be queried to get specific logs of exercises for a given user | userId*, from, to, limit (via query)

#### Example output:
* `{"_id":"5fda1383bb165d0493ae9427","username":"testUser"}`
* `[{"_id":"5fda1383bb165d0493ae9427","username":"testUser","log":[{"description":"testExercise","duration":15,"date":"2020-12-16T14:04:10.761Z"}],"count":1}]`

## How to use:
Be sure to change the argument for `mongoose.connect()` in `server.js` according to your own MongoDB server. It's also possible to just create a `.env` file and store this information there in order to keep it hidden and safe. Then, just run on terminal:
```
npm install
npm start
```
Developed for a Free Code Camp project. Original project idea link: [https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker)
