import express from 'express';

import {} from 'dotenv/config';

const app = express();
const port = 3000; // Choose the desired port number

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.send('Hello, World!');
});


// POST request to a specific endpoint

app.post('/api/autofill', async (req, res) => {

    // Access the request body data
    const { operationType, opertaion, updates, productName, policyholderLocator } = req.body;

    const zip_code = updates.fieldValues.ZIP_Code;

    const url = 'https://us-zip-code-information.p.rapidapi.com/?zipcode=' + zip_code;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.api_key,
            'X-RapidAPI-Host': 'us-zip-code-information.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        
        const js_obj = await response.json();
        const string_json = JSON.stringify(js_obj);
        const parse_json = JSON.parse(string_json);

        const result = {
            State: parse_json[0].State,
            City_Town: parse_json[0].City
        }

        //console.log(fieldValues);

        res.status(201).json({fieldValues : result}); 

    } catch (error) {
        console.error(error);
    }


    //res.status(201).json({ message: 'success' });
});



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
