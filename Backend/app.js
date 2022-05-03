'use strict';
const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
/*const passport = require('passport');*/
const xsenv = require('@sap/xsenv');
const dwsClient = require('@sap/dwf-dws-client');

try {
	const vcapAppl = JSON.parse(process.env.VCAP_APPLICATION);
	// const services = xsenv.readCFServices();
	const app = express();
	const rejectUnauth = false;

	const isCloud = !!(vcapAppl.cf_api);
	const loopBackUrl = isCloud ?
		`https://${vcapAppl.application_uris[0]}` :
		vcapAppl.full_application_uris[0];

	const TaskChain = dwsClient.taskChain.createTaskChainClient(xsenv.getServices({
		dwf: {
			tag: 'dwf'
		}
	}).dwf, loopBackUrl, rejectUnauth);

	/*
	passport.use('JWT', new dwsClient.helpers.JWTHybridStrategy(xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa));
	app.use(passport.initialize());
	app.use(passport.authenticate('JWT', { session: false }));
	*/

	app.use(bodyParser.json());
	app.use((err, req, resp, next) => {
		if (err) {
			console.error(err);
		}
		next(err, resp);
	});

	// Register Task Groups to the Data Warehouse Scheduler
	TaskChain.addRouter(app, '/backend');

	// Start HTTP server for callbacks from Data Warehouse Scheduler
	app.listen(PORT, listenErr => {
		if (listenErr) {
			console.error(listenErr);
			return process.exit(2);
		}
		TaskChain.registerTaskGroups(regErr => {
			if (regErr) {
				console.error(regErr);
				return process.exit(1);
			}
			console.log(`Backend module listening on port ${PORT}`);
		});
	});

} catch (e) {
	console.error(e);
	process.exit(3);
}