const express = require("express");
const path = require("path");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.route("/").get((req, res, next) => {
  const { sort } = req.query;

  if (sort) {
    if (!["id"].includes(sort)) {
      return res.status(400).send("Sort must have id");
    }
  }
  UsersService.getAllUsers(req.app.get("db"))
    .then(users => {
      if (sort) {
        users.sort((a, b) => {
          return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
      }
      res.json(UsersService.serializeUsers(users));
    })
    .catch(next);
});

usersRouter.post("/", jsonBodyParser, (req, res, next) => {
  const { password, user_name, full_name, email } = req.body;
  for (const field of ["full_name", "user_name", "email", "password"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  const passwordError = UsersService.validatePassword(password);

  const emailError = UsersService.validateEmail(email);

  if (passwordError) return res.status(400).json({ error: passwordError });

  if (emailError) return res.status(400).json({ error: emailError });

  UsersService.hasUserWithEmail(req.app.get("db"), email).then(
    hasUserWithEmail => {
      if (hasUserWithEmail)
        return res.status(400).json({ error: `Email already in use` });
    }
  );

  UsersService.hasUserWithUserName(req.app.get("db"), user_name, next)
    .then(hasUserWithUserName => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      return UsersService.hashPassword(password).then(hashedPassword => {
        const newUser = {
          user_name,
          password: hashedPassword,
          email,
          full_name,
          date_created: "now()"
        };

        return UsersService.insertUser(req.app.get("db"), newUser).then(
          user => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl + `/${user.id}`))
              .json(UsersService.serializeUser(user));
          }
        );
      });
    })
    .catch(next);
});

module.exports = usersRouter;
