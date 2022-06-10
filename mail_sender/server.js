/*eslint no-console: 0, no-unused-vars: 0, no-undef:0*/
/*eslint-env node, es6 */

"use strict";
var xsenv = require("@sap/xsenv");
var port = process.env.PORT || 3000;
var server = require("http").createServer();
var express = require("express");
var hdbext = require("@sap/hdbext");

//logging
var logging = require("@sap/logging");
var appContext = logging.createAppContext();

//Initialize Express App for XS UAA and HDBEXT Middleware
var app = express();


	let options = {};
	//Add SMTP
	try {
		options = Object.assign(options, xsenv.getServices({
			mail: {
				"name": "hana.smtp"
			},
			hana: {
			tag: "hana"
			}
		}));
	} catch (err) {
		console.log("[WARN]", err.message);
	}

//Initialize hanaConfig
var hanaConfig = {
	host: options.hana.host,
	port: options.hana.port,
	user: options.hana.user,
	password: options.hana.password
};

	const nodemailer = require("nodemailer");
	// create reusable transporter object using the default SMTP transport
	console.log(JSON.stringify(options.mail));
	
	
	let transporter = nodemailer.createTransport(options.mail);
	


function sendMail(container, taskchain, mail){
	// setup email data with unicode symbols
	console.log(mail);
	let mailOptions = {
		from: "\"Taskchain Monitor\" <NP0.do.not.reply@dsb.dk", // sender address
		to: mail,  // list of receivers
		subject: "Automated warning mail", // Subject line
		text: `taskchains(${taskchain}) in containers(${container}) has failed ` // plain text body
			//        html: '<b>Hello world?</b>' // html body
	};

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
	});}
	
function getMail(){
	
hdbext.createConnection(hanaConfig, function (error, client) {
		if (error) {
			console.log("Error trying to connect to HANA database ..." + error);
			return;
		}
		
		
var query;	
query =  `
SELECT 
STRING_AGG(CONTAINER,','ORDER BY CONTAINER DESC) AS CONTAINER, 
STRING_AGG(TASKCHAINID,','ORDER BY TASKCHAINID DESC) AS TASKCHAINID, 
EMAIL_ADDRESS
FROM "${options.hana.schema}"."DataWareHouse.Database.Tables::log.warning_mails" a
JOIN "${options.hana.schema}"."DataWareHouse.Database.Tables::log.log_rules" b ON (a.LOG_RULES_ID = b.ID)
JOIN "${options.hana.schema}"."DataWareHouse.Database.Tables::log.mail_list" d ON (a.MAIL_GROUP_ID = d.GROUP_ID)
JOIN "${options.hana.schema}"."DataWareHouse.Database.Tables::log.mail_individual" e ON (d.INDIVIDUAL_ID = e.ID)
group by 
EMAIL_ADDRESS`;
	


client.exec(query,
	function (err, rs) {
		if (err) {
			return console.log("Error select : " + err.message);
		}
	rs.forEach(row => {
	
		sendMail(row.CONTAINER, row.TASKCHAINID, row.EMAIL_ADDRESS);
	});
		query = `delete from ${options.hana.schema}."DataWareHouse.Database.Tables::log.warning_mails"`;
		client.exec(query);
	});
}

);}



//Start the Server 
setInterval(function () {
	var date = new Date();
	
		getMail();
	
}, 60000*5);