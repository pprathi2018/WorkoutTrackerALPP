# GAINSTOP: Workout and Fitness Tracker

Gainstop is a CRUD application using a Node.js backend with Express.js framework. User information including account details and workout data is stored with a MongoDB Atlas database. The User Interface is build with EJS files, combining HTML and Javascript, and styled through CSS. Middlewares such as Passport, Bcrypt, Mongoose, Connect-Flash, are used for user authentication, password encryption, NoSQL object modeling, and flash messaging, respectively. The application is dockerized in a single-container and a pipeline was created to automatically build an updated image from the Dockerfile in Github. This image is deployed in an Elastic Beanstalk instance at:

http://gainstop-env.eba-rsk6ssm7.us-east-1.elasticbeanstalk.com

### Development Details
* The bulk of endpoint routing is within server.js, while user login/signup implementation is done in userRoute.js
* A _Get_ request is made to each endpoint to render the specific ejs file. Necessary information is passed from server-side to EJS files through JSON objects
* Users have the ability to add to their goals and workouts with _Post_ request, modify their goals with a _Put_, and delete their workouts and goals with _Delete_
* Passport middleware is used to authenticate a user login, BCrypt is used to enrypt and decrypt a user's password when stored and retrieved from database

### Next Steps
* Configure the web server hosted on AWS for SSL certificate, and enable HTTPS to encrypt information and secure connections. 
