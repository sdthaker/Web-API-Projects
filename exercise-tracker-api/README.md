# API Project: Exercise Tracker for FCC

## User Stories
1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
2. I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will the the user object with also with the exercise fields added.
4. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

## Technologies
A little bit of what's inside the project:
- **Node.js** and **Express** to create the server and handle routes, requests and responses.
- **Mongoose** to persist all the data.

## Endpoints:

Endpoints | Description | Params
----------|-------------|-------------
POST `/api/users` | Create a new user | username*, _id (via body)
GET `/api/users` | Return all registered users | n/a
POST `/api/users/:_id/exercises` | Add an exercise for a specific user & respond with a json object with all details added | userId*, description*, duration*, date (via body)
GET `/api/users/:_id/logs?[from][&to][&limit]` | Return full log of a user's exercises along with the count of exercises | userId*, from, to, limit (via query)

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
