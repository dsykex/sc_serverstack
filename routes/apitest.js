const express = require("express");

const Router = express.Router();

// Very simple example
Router.post("/new-message/:identifier", (req, res) => {
  let id = req.params.identifier;
   let ad = req.query.admin;
  // You can do validation or database stuff before emiting
  req.io.emit("new-message", { content: `${id} ${ad}` });
  console.log('cheers!');
  return res.status(201).send({ success: true });
});

Router.post("/old-message", (req, res) => {
    let id = req.params.identifier;
     let ad = req.query.admin;
    // You can do validation or database stuff before emiting
    req.io.emit("new-message", { content: `${id} ${ad}` });
    console.log('cheers!');
    return res.status(201).send({ success: true });
});
  
module.exports = Router;