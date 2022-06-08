/*eslint no-console: 0, no-unused-vars: 0, no-undef:0*/
/*eslint-env node, es6 */

"use strict";
var xsenv = require("@sap/xsenv");
var port = process.env.PORT || 3000;
var server = require("http").createServer();
var express = require("express");

//logging
var logging = require("@sap/logging");
var appContext = logging.createAppContext();

//Initialize Express App for XS UAA and HDBEXT Middleware
var app = express();

app.use(logging.middleware({ appContext: appContext, logNetwork: true }));

app.get("/", (req, res) => {
	let options = {};
	//Add SMTP
	try {
		options = Object.assign(options, xsenv.getServices({
			mail: {
				"name": "hana.smtp"
			}
		}));
	} catch (err) {
		console.log("[WARN]", err.message);
	}
	const nodemailer = require("nodemailer");
	// create reusable transporter object using the default SMTP transport
	console.log(JSON.stringify(options.mail));
	let transporter = nodemailer.createTransport(options.mail);

	// setup email data with unicode symbols
	let mailOptions = {
		from: "\"Nic\" <NP0.do.not.reply@dsb.dk", // sender address
		to: "Nic <nichol@dsb.dk>", // list of receivers
		subject: "Mail Test from Pure Node.js using NodeMailer", // Subject line
		text: "The body of the mail from Pure Node.js using NodeMailer" // plain text body
			//        html: '<b>Hello world?</b>' // html body
	};
console.log(mailOptions);
console.log(options); 
	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log("Message sent: %s", info.messageId);
		// Preview only available when sending through an Ethereal account
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		var output = "Preview URL: " + nodemailer.getTestMessageUrl(info);
		res.type("text/html").status(200).send(output);
	});
});

//Start the Server 
server.on("request", app);
server.listen(port, function() {
	console.info(`HTTP Server: ${server.address().port}`);
});