/* server.js - Express server*/
'use strict';
const log = console.log
log('Express server')

const express = require('express')

const app = express();

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
	res.send('/index.html');
})

app.get('/api', (req, res) => {
	res.send('/api.html');
})

app.get('/examples', (req, res) => {
	res.send('/examples.html')
})

app.get('/problem', (req, res) => {
	res.status(500).send('There was a problem on the server')
})

const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
})