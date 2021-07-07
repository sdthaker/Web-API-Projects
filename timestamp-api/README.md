# Timestamp API

### User Stories:

> 1. I can pass a string as a URL parameter, and it will check to see whether that string contains either a Unix timestamp or a natural language date (ex. December 15, 2015 or Dec 15, 2015, with or without commas).

> 2. If it does, it returns both the Unix timestamp and the natural language form of that date.

> 3. If it does not contain a date or Unix timestamp, it returns null for those properties.

### Example Usage:

[https://timestamp-fccapi.glitch.me/api/2015-12-25](https://timestamp-fccapi.glitch.me/api/2015-12-25)

### Example Output:

```
{
"unix":1451001600000,
"utc":"Fri, 25 Dec 2015 00:00:00 GMT"
}
```

[https://timestamp-api-bq.herokuapp.com/api/1451001600000](https://timestamp-api-bq.herokuapp.com/api/1451001600000)

### Example Output:

```
{
"unix":1451001600000,
"utc":"Fri, 25 Dec 2015 00:00:00 GMT"
}
```

### Technologies Used:

* Node.js
* Express.js

Developed for a Free Code Camp project. Original project idea link: [https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/timestamp-microservice](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/timestamp-microservice)
