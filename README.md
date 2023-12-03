# Trevious-Backend

Ecommerce API with Node.js
This project is an API set to support e-commerce operations, including product and category listing, product details, cart management, and order processing. The API is built with Node.js and integrates with MongoDB for data storage. User authentication is implemented using JSON Web Tokens (JWT).

Prerequisites
Before running the project, ensure you have the following installed:

Node.js
npm (Node Package Manager)
MongoDB

1. first clone git repo
2. then cd those repoName
3. install dependencies
4. create folder structure
5. install npm init -y
6. npm i
7. create index.js main file
8. DB connection estabilished
9. create models
10. create controllers
11. create routes

Run this Project:- npm start 

Error Handling
The API returns meaningful error messages and status codes when necessary. For more details, refer to the API documentation.

Rate Limiting (Optional)
API rate limiting has been added to prevent abuse and maintain server stability.

API Documentation
API documentation is available in the Swagger format. Access the Swagger documentation at http://localhost:3002 after starting the server.

Important Design Decisions
MongoDB is chosen as the database for its flexibility and scalability.
JSON Web Tokens (JWT) are used for user authentication.
Rate limiting is implemented to prevent abuse.