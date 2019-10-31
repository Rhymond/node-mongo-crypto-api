# Exercise

Using Node.js and any datastore you see fit, you need to create a service that exposes two endpoints to save and retrieve values while storing them securely. All data at rest must be securely encrypted with the key provided by the clients. The service needs to handle all error conditions gracefully.

# How to run

To run tests and application run:

```bash
docker-compose up
```

# Endpoints

Currently there is only two endpoints to work with item:

* Save:

```curl
curl -v -XPOST -H "Content-type: application/json" -d '{
	"id": "item-id",
	"encryption_key": "password",
	"value": "{}"
}' 'http://localhost:3000/item'
```

* Get:

```curl
curl -v -XGET -H "Content-type: application/json" 'http://localhost:3000/item/:item-id?key=password'
```

**Things to note:**

* `:item-id` can be regex expression.
* Errors are handled gracefully and logged to stdout.


# Technical decisions

For encrypting/decrypting given value api is using "aes-256-cbc" algorithm with static vector set in docker-compose file as environment variable.

# Packages

Datastore: MongoDB
Server: Express
Linter: Eslint with Prettier
Testing: Jest

# TODO
[] e2e tests
