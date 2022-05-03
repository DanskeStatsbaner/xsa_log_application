# Backend
This module registers task types for the Data Warehouse Scheduler and provides
REST endpoints to execute tasks. The implementation resides in the
`@sap/dwf-dws-client` package (maintained as dependency in file `package.json`).

Note that you have to manually execute this module in order to be able to
design task chains and execute them in the DWF Monitor.
