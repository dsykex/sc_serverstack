"use strict";
const fs = require('fs');
const { createServer } = require("https");
const express = require('express');
const cors = require('cors');
let socketIo = require('socket.io');

const nodemailer = require("nodemailer");
const { info } = require("console");

const PORT_NUMBER = process.env.PORT || 3000;

const app = express();

var opts = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert'),
}

const server = createServer(opts, app);
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
    async function mail() {
      let transporter = nodemailer.createTransport({
        host: "empathystaffing.net",
        port: 465,
        secure: true, 
        auth: {
          user: 'info@empathystaffing.net', 
          pass: 'Money2021!', 
        },
      });
    
      await transporter.sendMail({
        from: `"Empathy Staffing" <${data.settings.admin_email}>`, // sender address
        to: `${data.contactInfo.email}`, // list of receivers
        subject: `Greetings, ${data.contactInfo.name}!`, // Subject line
        text: data.settings.greeting_msg, // plain text body
      }, err => {
        if(err)
          socket.emit('mail_res', {err: err.message});
        else
          socket.emit('mail_res', {success: true});
      });
    }
    mail()
  })
})

