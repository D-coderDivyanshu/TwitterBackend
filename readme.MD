# TWEETER BACKEND RESTFUL API
A RESTFUL api for tweeter backend.  

## Project Description
* It is an api(typescript) that handles user's sign up, login and CRUD operation on user's data. After user verification, the verified user can make, delete, updates his tweets.
* Currently it uses password less authentication (JWT) technique. To facilitate sign up i'm using simple email services. After successful sign up, user will get an access token which can be sent with request headers for later access.
* In it i'm using mongoDB which can easily be changed by any database without modifying the main program because of using **Prisma**.
* In this api i've used "**nodemailer**" nodejs module to send OTP through SMTP. "**nodemailer**" have simple implementations to send an email. 

##  Installation and Run the API
To install all the packages simply run  
```bash
npm install
```
After completion of installation run the server with command
```bash
npm start
```
Now you are ready to use the api

## How to use ?
In this repository a rest client file [request.http](./request.http) is given. In the file all the user routes are given.
