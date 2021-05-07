var nodemailer = require('nodemailer');

// Create the transporter with the required configuration for Outlook
// change the user and pass !
// var transporter = nodemailer.createTransport( {
//     host: "smtps-mail.outlook.com", // hostname
//     secureConnection: false, // TLS requires secureConnection to be false
//     port: 587, // port for secure SMTP
//     tls: {
//        ciphers:'SSLv3'
//     },
//     auth: {
//         user: 'fast-inventory@protonmail.com',
//         pass: 'management123'
//     }
// });


var nodemailer = require('nodemailer')

const mailTranspoter = nodemailer.createTransport(
    {
        host : "smtp.gmail.com" ,
        port : 587 ,
        secure:false,
        auth:{
             user:'fastinventorymanagementsystem@gmail.com',
            pass: 'management123'
        }
     }
    
     )





module.exports = mailTranspoter;

// var transporter = nodemailer.createTransport("SMTP", {
//     service: "hotmail",
//     auth: {
//         user: 'fast-inventory@protonmail.com',
//         pass: 'management123'
//     }
// });


// var transport = nodemailer.createTransport("SMTP", {
//     host: "smtp-mail.outlook.com", // hostname
//     secureConnection: false, // TLS requires secureConnection to be false
//     port: 587, // port for secure SMTP
//     auth: {
//         user: "user@outlook.com",
//         pass: "password"
//     },
//     tls: {
//         ciphers:'SSLv3'
//     }
// });


