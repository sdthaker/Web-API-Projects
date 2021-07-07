
# Small-ify, a URL Shortening API

### Built for all of your URL shortening needs.

> Pass a URL as a URL parameter and you'll receive a shortened URL in the JSON response.

> If you pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain an error instead.

> When you visit the shortened URL, you'll be redirected to your original link.

### Example Creation:

[https://url-shorter-microsrc.glitch.me](https://url-shorter-microsrc.glitch.me)
### Example Output:

The following JSON response will be returned.

```
{
"original_url":"http://google.com",
"short_url":62460}
```

### Example Usage:

[https://url-shorter-microsrc.glitch.me/api/shorturl/62460](https://url-shorter-microsrc.glitch.me/api/shorturl/62460)

Developed for a Free Code Camp project. Original project idea link: [https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice)
