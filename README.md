<h1>TeamUp Back End</h1>

This is a project created to support the TeamUp web app on the front end.

<h5>OBJECTIVE: An all-in-one App to streamline wedding planning process & Manage your budget at your fingertips. </h5>
  
 <h5> WHO WILL USE THIS: We are looking to target wedding planners, soon to be brides and grooms, and hopefully scale this to a wider target audience with custom event planners in mind</h5>

<br />


The project is currently live on Heroku: https://teamup-fe.herokuapp.com/. 
Postman can also be used to access the back end, with the following tables:

<br />

<h2>Users</h2>

| **URL** | **Method** | **Actions** |
|------------|-------------|------------|
| /api/v1/users/dashboard        | GET | show user dashboard
| /api/v1/login     | POST | login in user
| /api/v1/register    | POST | register user account
| /api/v1/users/profile   | GET | show user profile      
| /api/v1/users/profile/update   | PATCH | update user profile
| /api/v1/users/profile/delete      | DELETE | delete user
| /api/v1/:userActivationURL      | POST | new user password change

<br />

<h2>Guests</h2>

| **URL** | **Method** | **Actions** |
|------------|-------------|------------|
| /api/v1/users/guests | GET | show user guest list
| /api/v1/users/guests/create | POST | create user guest item
| /api/v1/users/guests/:guest-item | GET | show guest item
| /api/v1/users/guests/:guest-item/update | PATCH | update guest item     
| /api/v1/users/guest/:guest-item/delete | DELETE | delete guest item
| /api/v1/users/guests/login | POST | guest login
| /api/v1/users/guests/:guest-id/rsvp | PATCH | update guest RSVP


<br />

<h2>Todos</h2>

| **URL** | **Method** | **Actions** |
|------------|-------------|------------|
| /api/v1/users/todos | GET | show user todo list
| /api/v1/users/todos/create | POST | create user todo item
| /api/v1/users/todos/:todo-item | GET | show todo item
| /api/v1/users/todos/:todo-item/update | PATCH | update todo item     
| /api/v1/users/todos/:todo-item/delete | DELETE | delete todo item

<br />

<h2>Budgets</h2>

| **URL** | **Method** | **Actions** |
|------------|-------------|------------|
| /api/v1/users/budget | GET | show user budgets list
| /api/v1/users/budget/create | POST | create user budget item
| /api/v1/users/budget/:budget-item | GET | show budget item
| /api/v1/users/budget/:budget-item/update | PATCH | update budget item     
| /api/v1/users/budget/:budget-item/delete | DELETE | delete budget item

<br />

<h2>Events</h2>

| **URL** | **Method** | **Actions** |
|------------|-------------|------------|
| /api/v1/users/events | GET | show user events list
| /api/v1/users/events/create | POST | create user event item
| /api/v1/users/events/:event-item | GET | show event item
| /api/v1/users/events/:event-item/update | PATCH | update event item     
| /api/v1/users/events/:event-item/delete | DELETE | delete event item

<br />

Some Dependencies that I've used in this project:

- Axios
- Bcrypt
- CORS 
- DotEnv
- Express: NodeJS web application framework
- JOI
- JSON Web Token
- Lodash
- Mailgun JS 
- Moment JS
- Mongoose DB
- randomstring
- UUID

<h4>Some features to be implemented or improved upon: </h4>

- [ ] Overall code clean up and refactoring
