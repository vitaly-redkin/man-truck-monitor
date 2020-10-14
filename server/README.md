# MAN Truck Node Server

MAN Truck Node Server

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
* Invoke the `/vehicle` endpoint a
  ```shell
  curl http://localhost:3001/api/v1/vehicle
  ```
  or
  ```shell
  curl http://localhost:3001/api/v1/vehicle/1?step_no=10
  ```
* Navigate the Swagger link on the "home page" above and test the end point using Swagger
 
## Notes About Code
The code structure is a bit overengineered for the task. But in the real life this structure may make adding new features easier and separate the end point processing from the business logic.
I used SQLite as a database to reduce the number of installable dependencies and to save myself a headache when deploying
the application to Heroku. In the real life I would use the PostgreSQL or any other "real" database.
The "demo data" is populated on the application start and is never changed - the application only reads the data.
Also there is somewhat primitive and excessive (error) logging used - in the real app some common startegy and probably the third party systems (like [Sentry](https://www.sentry.io) should be used.

## Validation
Input validation is done by the Open API using the ```api.yml``` file.

## Configuration
```.env``` file (not added to Git) and ```end.examlr``` file (the template to create a real one).

