# GAINSTOP: Workout and Fitness Tracker

We have developed a CRUD application using a Node.js backend with Express.js framework. User information including account details and workout data is stored with a MongoDB Atlas database. The User Interface is build using EJS files, combining HTML and Javascript, and styled through CSS. Various middlewares such as Passport, Bcrypt, Mongoose, Connect-Flash, are used for user authentication, password encryption, NoSQL object modeling, and flash messaging, respectively. The application is dockerized in a single-container and a pipeline was created to automatically build an updated image from the Dockerfile in Github. This image is then deployed in an Elastic Beanstalk instance at:

http://gainstop-env.eba-rsk6ssm7.us-east-1.elasticbeanstalk.com

### Development Setup 
