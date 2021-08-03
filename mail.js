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

const mailTranspoter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            type: 'OAuth2',
            user: "fastinventorymanagementsystem@gmail.com",
            clientId: '967491064309-etd9t01v5mvo7052mriblbiq9b7eok1s.apps.googleusercontent.com',
            clientSecret: 'A1g16ZZYFqyOQyPV2tJeRI5Y',
            refreshToken: '1//04PN8R99-UsezCgYIARAAGAQSNwF-L9Ir3dOgu7zJCLybHomDrCZXelt4CCY8X_8EcCcckSyxWtWpje4xY8-k__mJRjlP4iS8U2Q',
            accessToken: 'ya29.a0ARrdaM86D3gvrDis9fL7NybMOF5aAhZhjDYopxZvB5Q5p51L2CpkAe_XJTbPLT6xlCsin0h1YuQHMdVH2Dxqqao8egevVl_-qbnpV54nyBJMILytYbJmXOlUBq8qpASWPV6SyI83zTrejlm1G8UOjZ0kuA3g'
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