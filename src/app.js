require("dotenv").config();
const nodemailer = require('"nodemailer"');
const bodyParser = require("body-parser");


const express = require("express"); /* getting access to the express framework */
const path = require("path"); /* A utility to construct full system paths based on relative paths  */
const JOBS = require("./jobs");
const mustacheExpress = require("mustache-express");
/*v const { match } = require("assert");
const { error } = require("console"); */

const app = express(); /* creating an express app */
console.log(process.env.EMAIL_PASS)
app.use(bodyParser.urlencoded({ extended: false }));
const transporter = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 465,
    secure: true,
    auth: {
      user:process.env.EMAIL_ID,
      pass:process.env.EMAIL_PASSWORD
    }
   
});

    


app.post("/jobs/:id/apply", (req, res) => {
 // console.log("req.body", req.body);
  const { name, email, phone, dob, coverletter } = req.body;

  console.log("New Application", { name, email, phone, dob, coverletter });

  const id = req.params.id;
  const matchedJob = JOBS.find(job => job.id.toString() === id);
  console.log("req.body", req.body);
  console.log("id", id);
  console.log("matchedJob",matchedJob);
  
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: process.env.EMAIL_ID,
    subject: `New Application for ${matchedJob.title}`,
    html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date of Birth:</strong> ${dob}</p>
        <p><strong>Cover Letter:</strong> ${coverletter}</p>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

/* configure mustache */
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "./pages"));
app.set("view engine", "mustache");
app.engine("mustache", mustacheExpress());
//

/* accessing server root level route *res-request ,res(response object)*/
app.get("/", (req, res) => {
  /*  res.sendFile(path.join(__dirname,'pages/index.html')); */
  res.render("index", { jobs: JOBS });
  console.log(JOBS);
});

app.get('/jobs/:id', (req, res) => {
    const id = req.params.id;
    const matchedJob = JOBS.find(job => job.id.toString() === id);
    res.render('job', { job: matchedJob});
})
app.post("/jobs/:id/apply", (req, res) => {
  res.send("Got the application");
});

/* Run the server */
const port = process.env.PORT || 3000;
/* .Listen -app will start lsitening for requests - port(mailbox number/prot number) */
app.listen(port, () => {
  console.log(`Server runnning on htps:/localhost:${port}`);
});
