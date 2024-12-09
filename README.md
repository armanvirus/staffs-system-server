# node-express-starter <br/>
A painless codebase to build your apps on in no time. It's a basic node/express basic templete that covers signup and email verification, login, forgot password and reset password. This codebase got you covered for any basic code, all you have to is to focus on main functionality of your app. 
## Routes
* /user/auth/login <br/>
-Sample Request Data
  ```{
    "email":"armangrema@gmail.com",
    "password":"abcd"
}
  &ensp;&ensp;&ensp;&ensp;This route is used for user login, where it issue a JWT verification token for authentication and authorization in a protected routes 
* /user/auth/register <br/>
-Sample Request Data
  ```{
    "email":"armangrema@gmail.com",
    "password":"abcd"
}
  &ensp;&ensp;&ensp;&ensp;This Route register the user and sends email for account verification
* /user/auth/confirm/email/:token/:user <br/>
  &ensp;&ensp;&ensp;&ensp;A route that  confirms the email when a user follows link sent to him in account when he registers his email account
* /user/auth/forgot/password/init <br/>
-Sample Request Data
  ```{
    "email":"armangrema@gmail.com",
}
    &ensp;&ensp;&ensp;&ensp;A route that issue for forgot password email for forgot password
* /user/auth/password/change/:token/:issuer <br/>
   ```{
    "password":"123456",
}
  &ensp;&ensp;&ensp;&ensp;Its used for setting the password password after the issued forgot password link is followed from the user's mail  box
* /user/auth/password/reset <br/>
  &ensp;&ensp;&ensp;&ensp;Its used for reseting password
  -Sample Request Data
  ```{
    "oldPassword":"1234",
    "newPassword":"abcd"
}
