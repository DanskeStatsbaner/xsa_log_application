# Data Warehousing Project

## Overview
This is a project created from the SAP HANA data warehousing foundation project
template. For more information on Data Warehousing Foundation (DWF), consult the
[SAP Help Portal](https://help.sap.com/viewer/p/SAP_HANA_DATA_WAREHOUSING_FOUNDATION).

The project contains three modules:

1. The database module (type SAP HANA Database) contains the database model
   that is deployed via the SAP HANA deployment infrastructure.
2. The DWF module contains deployment artifacts that are specifically for data
   warehouse projects like task chains or data lifecycle management (DLM)
   profiles.
3. The backend module is a standard [Node.js](https://nodejs.org/en/) module
   that has to be executed after building all modules in order to
   - register the task types to the Data Warehouse Scheduler (DWS), which is a
     prerequisite to execute task chains
   - provide REST endpoints for task execution but also value help, i.e., the
     module must also run in order to model task chains

## Project Template Options
When creating a project based on the DWF project template (like this one), you
are offered several options, for example "Enforce User Authentication". These
options alter several project files by commenting irrelevant sections. That
means your choice can be reverted manually afterwards which is decribed here.

### Enforce User Authentication
The backend module exposes REST endpoints for scheduler task execution and value
help assisting in development. If this option is set, these endpoints are
secured by binding to the User Account and Authentication (UAA) service and
requires login with a user that has the corresponding application scope
assigned to them.

Note that UAA service binding is not supported by SAP Web IDE. This option
should only be selected if you're not planning to further develop the project in
Web IDE, but only want to build the project archive and deploy it somewhere else
(e.g. for productive usage).

In case you have developed in SAP Web IDE without this option and now would like
to enable UAA protection due to go-live, you can uncomment the following
sections:
* `mta.yaml`: under 'modules', backend add the UAA requirement and the
  `SAP_JWT_TRUST_ACL` property. Under resources enable the whole block for the
  UAA service binding
* `Backend/app.js`: Uncomment the block using the passport package which handles
  OAuth-based authentication by JWT token

### Enable SSL Validation
Controls if outgoing requests to the DWF runtime backend for task type
registration validate the received SSL certificates.

Effectively, this option controls the boolean variable `rejectUnauth` in
`Backend/app.js` (true meaning SSL validation is active).

This option should usually be active, unless you encounter SSL-related issues
during setup of a non-productive system.

### Use Static Service Names
To allow multiple developers working the same space, SAP Web IDE by default
generates user and workspace specific prefixes to service and app names. By
using this option you may override that functionality but then you have to take
care of proper separation yourself (e.g. every user gets their own space).

You are not advised to use this as it bypasses the SAP Web IDE isolation concept.
This option is therefore considered depcrecated and will be removed.

### Trigger Build Automatically
With this option, all three modules are built immediately after creating the
project.
When you read this, the build may have been implemented but for future projects
you may consider not using this as build time is considerable.

Note that while the backend module is also built by this, you still have to
*run* it manually afterwards.
