var nodemailer = require('nodemailer');


function sendEmail(mailTo) {
    console.log('inside sendEmail mailTo is-->', mailTo);   
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'm.osamaalmokadem@gmail.com',
        pass: 'loveyoubaby'
      }
    });
    
    var mailOptions = {
      from: 'm.osamaalmokadem@gmail.com',
      to: mailTo,
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }