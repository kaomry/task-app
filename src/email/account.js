const sgMail = require('@sendgrid/mail')

//Getting the key from system variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'omrykaufman@gmail.com',
        subject: 'Thanks foy joining in!',
        text: `Welcome to the app, ${name}. let me know how you get along with the app`
    })
}

const sendCCencelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'omrykaufman@gmail.com',
        subject: 'So sorry to see you going',
        text: `Hi ${name}, just before you go can you please specify one thing we could do better?`
    })
}

module.exports = {
    sendWelcomeEmail,sendCCencelationEmail
}