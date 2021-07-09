![visitors](https://visitor-badge.glitch.me/badge?page_id=sdthaker.visitor-badge)

# URL Shortening API

### Built for all of your URL shortening needs.

> Pass a URL as a URL parameter and you'll receive a shortened URL in the JSON response.

> If you pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain an error instead.

> When you visit the shortened URL, you'll be redirected to your original link.

### Example Creation:

[https://url-shortener-fccapi.glitch.me](https://url-shortener-fccapi.glitch.me)
### Example Output:

The following JSON response will be returned.

```
{
"original_url":"http://google.com",
"short_url":40655
}
```

### Example Usage:

[https://url-shortener-fccapi.glitch.me/api/shorturl/40655](https://url-shortener-fccapi.glitch.me/api/shorturl/40655)

Developed for a Free Code Camp project. Original project idea link: [https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice)
