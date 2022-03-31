const express = require('express') // express module need to install.
const https = require("https"); // Built in http module in node.js, no need to install.
const request = require('request');
const bodyParser = require('body-parser') // npm pakage, need to install.
const client = require("@mailchimp/mailchimp_marketing");
 
const app = express();

require('dotenv').config()
MC_apiKey = process.env.apiKey
MC_server = process.env.server
MC_listId = process.env.listId

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});
 
client.setConfig({
    apiKey: MC_apiKey, 
    server: MC_server, 
});
 
app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    // console.log(firstName, lastName, email);
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }
    const run = async () => {
        try {
            const response = await client.lists.addListMember(MC_listId, { 
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            //   console.log(response);
            res.sendFile(__dirname + "/success.html");
        } catch (err) {
            if (err.status < 300 || (err.status === 400)) {
                res.sendFile(__dirname + "/success.html");
            } else {
                console.log(err.status);
                res.sendFile(__dirname + "/failure.html");
            }   
        }
    };
 
  run();
});
 
app.post("/failure", function(req, res) {
  res.redirect("/");
});
 
app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});