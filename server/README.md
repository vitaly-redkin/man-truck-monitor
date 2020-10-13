# Urban Geo Locator

Urban Test Task Server

## Quick Start

```shell
# install deps
yarn install

# run in development mode
yarn run dev

# run tests
yarn run test
```

---

## General Information
The source code has been generated using the [Yo Generator](https://github.com/cdimascio/generator-express-no-stress-typescript). It generated an empty NodeJS/Express server application with Typescript and [OpenAPI spec](https://swagger.io/specification/) support. It uses a pretty common controller/service code separation. Controller (used in the routes) defines methods to serve the end points. Services do the real job, sometimes using methods/classes from other files. Swagger specification is in the server/common/api.yml file.

## Try It
* Open you're browser to [http://localhost:3001](http://localhost:3001)
* Invoke the `/geolocation` endpoint 
  ```shell
  curl http://localhost:3001/api/v1/geolocation?search=111&address=London
  ```
* Navigate the Swagger link on the "home page" above and test the end point using Swagger
 
## Notes About Code
The code structure is a bit overengineered for the task. But in the real life this structure may make adding new features easier and separate the end point processing from the business logic.
The requirement to use several Geo Coding providers is implemented using the base (abstract) class and inheriting the "real" implementations (like Google Maps Geo Coding Provider) from this base class. Then you define the list of provider objects to be called sequentially (if the "top" provider rerurns an error). The same effect could be achieved using the FP paradigm instead of the OOP one used (i.e. every provider should include functions to prepare the address, to make the request and to exract the required data from the result) - but the classes I implemented use teh same thing with a bit less "magic".
Also there is somewhat primitive and excessive (error) logging used - in the real app some common startegy and probably the thord party systems (like [Sentry](https://www.sentry.io) should be used.

## Implementation Notes
Google Maps Geo Coding API returns both the full address by coordinates, and the parts of it, not easily mappable to the Address1, Address2 and City fields you wanted in the result. So I decided to return the full address and the postal code (if I can find it).

## Validation
Input validation is done by the Open API using the ```api.yml``` file.

## Caching
I implemented the caching in the service layer (i.e. in the function level) instead of the API level. I believe such approach is more flexible if you want to use the same functionality in more end points instead of the only one.
The cache is an "in memory" one - in the real life some more advanced implementation (which used Redis, for example) should be used.
I cache the whole result (address -> coordinates -> service area/etc.). In your line of business you will hardly receive many requests with slightly different addresses resolving to the same coordinates - like for example the taxi services may. Plus, the service area search in the static GeoJSON file works much faster than the address -> coordinates search with the external API call, at least for the file provided.
I considered adding a file dependency and the GeoJSON file cache - but decided aganst it (it is not like many people are doing surgical deployments with FTP anymore, and the whole NodeJS server should be stateless and quickly restartable anyway).

## Configuration
```.env``` file (not added to Git) and ```end.SAMPLE``` file (the template to create a real one). Please replace the ```GOOGLE_MAPS_API_KEY``` value with your own key or at least do not abuse my one.

