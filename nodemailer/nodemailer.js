var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service:'smtp-mail.outlook.com',
    secureConnection:false,
    port:587,
    tls:{
        ciphers:'SSLV3',
        rejectUnauthorized:false
    },
    auth:{
        user:'groupprojectcs554fall2020@outlook.com',
        password:'cs554.groupproject'
    }
})