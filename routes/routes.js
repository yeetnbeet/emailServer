require('dotenv').config()

// routes.js
const router = require('express').Router()
const path = require('path')
const nodemailer = require('nodemailer')

const transport = {
    //this is the authentication for sending email.
host: 'smtp.gmail.com',
port: 465,
secure: true, // use TLS
//create a .env file and define the process.env variables 
//with your credentials.
auth: {
    user: process.env.SMTP_TO_EMAIL,
    pass: process.env.SMTP_TO_PASSWORD,
},
}

const transporter = nodemailer.createTransport(transport)
    transporter.verify((error, success) => {
if (error) {
    //if error happened code ends here
    console.error(error)
} else {
    //this means success
    console.log('Ready to send mail!')
}
})

router.get('/', (req, res, next) => {
    res.status(200).json({ msg: 'Working' })
    })

router.post('/', (req, res, next) => {
    //make mailable object
    const mail = {
    from: process.env.SMTP_FROM_EMAIL,
    to: req.body.Email,
    subject: 'Bike Sizer',
    text: `
      from:
      Contender Bicycles

      details

      Saddle Height: ${req.body.SaddleHeight}      
      Minimum Reach: ${req.body.ReachMin}
      Maximum Reach: ${req.body.ReachMax}      
      Stack Height:  ${req.body.StackHeight}

      Rider Stats

      Height: ${req.body.Height}
      Torso Length: ${req.body.Torso} 

      message:
      ${req.body.message}`,
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: 'fail',
                message: err
            })
        } else {
            res.json({
                status: 'success',
            })
        }
    })
})

router.use('/api', function (req, res) {
    res.set('Content-Type', 'application/json')
    res.send('{"message":"Hello from the custom server!"}')
})

router.use('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '/react- ui/build', 'index.html'))
})



module.exports = router