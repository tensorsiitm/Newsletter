const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//BodyParser middleware
app.use(bodyParser.urlencoded({extended: true}))

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

//Subscribe Route
app.post('/subscribe', (req, res) => {
    const { firstName, lastName, email, phone} = req.body;
    //Make Sure Filled
    if(!firstName || !lastName || !email) {
        res.redirect('/fail.html')
    }

    //Construct Request Data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    PHONE: phone
                }
            }
        ]
    }

    const postData = JSON.stringify(data);

    fetch('https://us2.api.mailchimp.com/3.0/lists/fd87ede4f7', {
        method: 'POST',
        headers: {
        Authorization: 'auth fda09fc278d8022a1a84e7598e829579-us2'
        },
        body: postData
    })
        .then(res.statusCode === 200 ?
        res.redirect('/success.html') :
        res.redirect('/fail.html'))
        .catch(err => console.log(err))

})



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));


