"use strict";
const { createServer } = require("http");
const express = require('express');
const cors = require('cors');
let socketIo = require('socket.io');

const nodemailer = require("nodemailer");
const { info } = require("console");

const PORT_NUMBER = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = socketIo(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST']
  }
})

app
  .use(express.json())
  .use(cors({origin: '*'}))
  .use((req, res, next) => {
    req.io = io;
    return next();
  })
  .use('/api', require('./routes/apitest'))

server.listen(PORT_NUMBER, () => { console.log(`Server started on port ${PORT_NUMBER}`) })

io.on('connection', socket => {
  console.log('new user');
  socket.emit('msg', 'sockey')
  socket.on('contact_added', data => {
    let transporter = nodemailer.createTransport({
      host: "empathystaffing.net",
      port: 465,
      secure: true, 
      auth: {
        user: 'info@empathystaffing.net', 
        pass: 'Money2021!', 
      },
    });
  
    transporter.sendMail({
      from: '"Empathy Staffing" <info@empathystaffing.net>', // sender address
      to: `${data.email}`, // list of receivers
      subject: `Greetings, ${data.name}!`, // Subject line
      text: "This is a test email from the server!", // plain text body
      
    }, err => {
      if(err)
        socket.emit('mail_res', {err: err.message});
      else
        socket.emit('mail_res', {success: true});
    });

  })
})

