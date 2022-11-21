const sgMail = require('@sendgrid/mail');
const { text } = require('express');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'timjameswoods@gmail.com',
        subject: 'Welcome to the Task App - a nodejs learning project',
        text: `Hi ${name}, thanks for trying out this app.`
    });
}

const sendCancelAccount = (email, name) => {
    sgMail.send({
        to: email,
        from: 'timjameswoods@gmail.com',
        subject: 'Sorry to see you go',
        text: `We've cancelled your account, ${name} - sorry to see you go.`
    })
}

module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendCancelAccount: sendCancelAccount
}