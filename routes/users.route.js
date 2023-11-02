const express = require("express");
const userRoute = express.Router();
const path = require("path");
const fs = require("fs");

const userPath = path.join(__dirname, "../data/users.json");
const postPath = path.join(__dirname, "../data/posts.json");

// middleware check email user
const checkUserExists = (req, res, next) => {
  const userEmail = req.body.email;
  fs.readFile(userPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send("Invalid");
      return;
    }
    const userData = JSON.parse(data);
    const userExist = userData.find((user) => user.email === userEmail);
    if (userExist) {
      res.status(409).send("User already exists");
    } else {
      next();
    }
  });
};

// get all users
userRoute.get("/", (req, res) => {
  fs.readFile(userPath, "utf8", (err, data) => {
    if (err) {
      res.write(err);
      res.status(400).send("Invalid");
      return;
    }
    const userData = JSON.parse(data);
    res.status(200).json(userData);
  });
});

// get one user
userRoute.get("/:id", (req, res) => {
  fs.readFile(userPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send("Invalid");
      return;
    }
    const userData = JSON.parse(data);
    const user = userData.find((item) => item.id == req.params.id);
    res.status(200).json(user);
  });
});

// get posts of user
userRoute.get("/:id/posts", (req, res) => {
  const userId = req.params.id;
  fs.readFile(postPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send("Invalid post");
      return;
    }
    const postData = JSON.parse(data);
    const userPosts = postData.filter((post) => post.userId == userId);
    res.status(200).json(userPosts);
  });
});

// create user
userRoute.post("/create", checkUserExists, (req, res) => {
  fs.readFile(userPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send("Invalid");
      return;
    }
    const userData = JSON.parse(data);
    const newUser = {
      id: userData[userData.length - 1].id + 1,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      address: {
        street: req.body.address.street,
        suite: req.body.address.suite,
        city: req.body.address.city,
        zipcode: req.body.address.zipcode,
        geo: {
          lat: req.body.address.geo.lat,
          lng: req.body.address.geo.lng,
        },
      },
      phone: req.body.phone,
      website: req.body.website,
      company: {
        name: req.body.company.name,
        catchPhrase: req.body.company.catchPhrase,
        bs: req.body.company.bs,
      },
    };
    const user = userData.find((item) => item.id == newUser.id);
    if (!user) {
      userData.push(newUser);
      fs.writeFile(userPath, JSON.stringify(userData), "utf8", (err) => {
        if (err) {
          console.error(err);
          res.status(400).send("Invalid");
          return;
        }
        res.status(200).json({ message: "Create successfully" });
      });
    }
  });
});

// update user
userRoute.put("/:id", (req, res) => {
  fs.readFile(userPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send("Invalid");
      return;
    }
    const userData = JSON.parse(data);
    const indexUser = userData.findIndex((item) => item.id == req.params.id);
    if (userData == -1) {
      res.status(404).send("User not found");
      return;
    }
    userData[indexUser] = { ...userData[indexUser], ...req.body };
    fs.writeFile(userPath, JSON.stringify(userData), "utf8", (err) => {
      if (err) {
        console.error(err);
        res.status(400).send("Invalid");
        return;
      }
      res.status(200).json(userData);
    });
  });
});

// delete user
userRoute.delete("/:id", (req, res) => {
  fs.readFile(userPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send("Invalid");
    }
    const userData = JSON.parse(data);
    const newData = userData.filter((item) => item.id != req.params.id);
    fs.writeFile(userPath, JSON.stringify(newData), "utf8", (err) => {
      if (err) {
        console.error(err);
        res.status(400).send("Invalid");
        return;
      }
      res.status(200).json(newData);
    });
  });
});

module.exports = userRoute;
