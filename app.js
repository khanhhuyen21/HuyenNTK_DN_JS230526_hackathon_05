require("dotenv").config();
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.json());
const indexHtml = fs.readFileSync("./index.html", "utf8");
const userRoute = require("./routes/users.route");
const postRoute = require("./routes/posts.route");
app.get("/", (req, res) => {
  res.send(indexHtml);
});
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/ `);
});
