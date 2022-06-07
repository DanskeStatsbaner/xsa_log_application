/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";
var util = require("util");
var query;
var RestApiUrl;
var username;
var passw;
var auth;
var config;
var resp;
var resptab;
var maxdate;

var xsjs = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port = process.env.PORT || 3000;
var axios = require("axios");
var hdbext = require("@sap/hdbext");
var async = require("async");

var options = {
	anonymous: true, // remove to authenticate calls
	auditLog: {
		logToConsole: true
	}, // change to auditlog service for productive scenarios
	redirectUrl: "/index.xsjs"
};

// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({
		hana: {
			tag: "hana"
		}
	}));
} catch (err) {
	console.log("configure HANA: [WARN]", err.message);
}

var hanaConfig = {
	host: options.hana.host,
	port: options.hana.port,
	user: options.hana.user,
	password: options.hana.password
};

function sendUserEmail() {
    try {
      	var from = "test@test.com";
        var to = $.request.parameters.get("email");
        var subject = $.request.parameters.get("subject");
        var message = $.request.parameters.get("message");
        
        var mail = new $.net.Mail({
        	    sender: {address: from},
        	    to: [{ address: to}],
        	    subject: "Subject : "+subject+" ",
        	    subjectEncoding:"UTF-8",
        	    parts: [ new $.net.Mail.Part({
        	        type: $.net.Mail.Part.TYPE_TEXT,
        	        contentType: "text/plain", 
        	        text: message,
        	        encoding:"UTF-8"
        	    })]
        });
        var returnValue = mail.send();
        var response = "MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply;
        
        $.response.setBody(JSON.stringify(response));
    }  
    catch (e) {  
        Dataset.response = e.message + " ";
    }  
}