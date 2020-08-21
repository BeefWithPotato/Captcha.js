/* server.js - Express server*/
'use strict';
const log = console.log
log('Express server')

const express = require('express')

const app = express();

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
	res.send('<!DOCTYPE HTML>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>VerifyCode.js</title>
</head>
<body style="background-color: #e6ecf0;">
	<div style="margin-top: 15%; text-align: center; font-size: 100px; font-family: 'Pathway Gothic One', sans-serif;">
		VerifyCode.js
	</div>

	<p style="text-align: center;">Design your verification code with characteristics.</p>

	<div class="link">
		<a href="/examples.html">Exampes</a>

		<a>API</a>

		<a>Download</a>
	</div>
</body>');
})

app.get('/api.html', (req, res) => {
	res.send('/api.html');
})

app.get('/examples.html', (req, res) => {
	res.send('/examples.html')
})

app.get('/problem', (req, res) => {
	res.status(500).send('There was a problem on the server')
})

const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
})