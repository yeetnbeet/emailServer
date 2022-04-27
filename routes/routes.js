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
    html: `
      <img src='https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0483%2F9040%2F6312%2Ffiles%2Fcontender-logo.png%3Fheight%3D628%26pad_color%3Dfff%26v%3D1614105490%26width%3D1200&imgrefurl=https%3A%2F%2Fcontenderbicycles.com%2F&tbnid=wtvH-WjOEVV9uM&vet=12ahUKEwjPpZOt_LT3AhVcFzQIHTCFCfEQMygAegUIARCsAQ..i&docid=-AIHG03kHjmtxM&w=1200&h=628&q=contender%20bikes&ved=2ahUKEwjPpZOt_LT3AhVcFzQIHTCFCfEQMygAegUIARCsAQ'></img>
      <p>Thank you for using the Contender Bicycles bike sizer. Below are the results from your input into the sizer. Please note these measurements are in cm.</p>
      <div></div>
      <p>Details:</p>

      <li>Saddle Height: ${req.body.SaddleHeight} cm</li>      
      <li>Minimum Reach: ${req.body.ReachMin} cm</li>
      <li>Maximum Reach: ${req.body.ReachMax} cm</li>      
      <li>Stack Height:  ${req.body.StackHeight} cm</li>
      <div></div>  
      <p>Rider Stats:</p>

      <li>Height: ${req.body.Height} cm</li>
      <li>Torso Length: ${req.body.Torso} cm</li> 
      <div></div>
      <p>Contender Bicycles is devoted to providing the best bike shop experience possible for those who are passionate about cycling. If you have any additional questions or would like further assistance in sizing, please email us at info@contenderbicycles.com or call us at (801) 364-0344. 
      </p>
      `,
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