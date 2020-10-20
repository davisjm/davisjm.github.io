//import express and body parse and initialise your app

//jshint esversion:6

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
//let's allow our app to get requests and give response from servers to this server we creating

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

//POST

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  // console.log(firstName, lastName, email);

  const data = {
    members: [
      {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName

      }
    }
  ]

  };

  //for failure case, we need to be able to return back to the main page inorder to try again.

  app.post("/failure", function(req, res){
    res.redirect("/");
  });

  //finally we have to change our entered infos to JSON format.

  const jsonData = JSON.stringify(data);

  const url = "https://us2.api.mailchimp.com/3.0/lists/0e3fea8dea";

  const options =
  {
    method: "POST",
    auth: "davis13:326166ceaa555ab768408e3326776827-us2"
  };

  const request = https.request(url, options, function(response){
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    } else(
      res.sendFile(__dirname+"/failure.html")
    );

  });
  request.write(jsonData);
  request.end();
});



//let's declare or direct or app to a specific port/path once the app is loaded
app.listen(process.env.PORT || 8000, () => {
  console.log("Port 8000 has started");
});


//mailchimp api
// 326166ceaa555ab768408e3326776827-us2

//List ID.
//0e3fea8dea
