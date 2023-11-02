const express = require("express");
const postRoute = express.Router();
const path = require("path");
const fs = require("fs");

const postPath = path.join(__dirname, "../data/posts.json");

// get all posts
postRoute.get("/", (req, res) => {
  fs.readFile(postPath, "utf8", (err, data) => {
    if (err) {
      res.write(err);
      res.status(400).send("Invalid");
      return;
    }
    const postData = JSON.parse(data);
    res.status(200).json(postData);
  });
});

// get one post
postRoute.get("/:id", (req, res) => {
  fs.readFile(postPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send("Invalid");
      return;
    }
    const postData = JSON.parse(data);
    const post = postData.find((item) => item.id == req.params.id);
    res.status(200).json(post);
  });
});

// create post
postRoute.post("/create", (req, res) => {
  fs.readFile(postPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send("Invalid");
      return;
    }
    const postData = JSON.parse(data);
    const newPost = {
      userId: req.body.userId,
      id: postData[postData.length - 1].id + 1,
      title: req.body.title,
      body: req.body.body,
    };
    console.log(newPost);
    const post = postData.find((item) => item.id == newPost.id);
    if (!post) {
      postData.push(newPost);
      fs.writeFile(postPath, JSON.stringify(postData), "utf8", (err) => {
        if (err) {
          console.error(err);
          res.status(400).send("Invalid");
          return;
        }
        res.status(200).json({ message: "Create successfully" });
        return;
      });
    }
  });
});

// update post
postRoute.put("/:id", (req, res) => {
  fs.readFile(postPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send("Invalid");
      return;
    }
    const postData = JSON.parse(data);
    const indexPost = postData.findIndex((item) => item.id == req.params.id);
    if (postData == -1) {
      res.status(404).send("Post not found");
      return;
    }
    postData[indexPost] = { ...postData[indexPost], ...req.body };
    fs.writeFile(postPath, JSON.stringify(postData), "utf8", (err) => {
      if (err) {
        console.error(err);
        res.status(400).send("Invalid");
        return;
      }
      res.status(200).json(postData);
    });
  });
});

//delete post
postRoute.delete("/:id", (req, res) => {
  fs.readFile(postPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send("Invalid");
    }
    const postData = JSON.parse(data);
    const newData = postData.filter((item) => item.id != req.params.id);
    fs.writeFile(postPath, JSON.stringify(newData), "utf8", (err) => {
      if (err) {
        console.error(err);
        res.status(400).send("Invalid");
        return;
      }
      res.status(200).json(newData);
    });
  });
});

module.exports = postRoute;
