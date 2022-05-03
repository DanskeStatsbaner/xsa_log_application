# Data Warehousing Foundation (DWF)
The `src` folder contains the DWF artifact definitions. Deployment is
implemented by building the module and by the `@sap/dwf-deploy` package
(maintained as dependency in file `package.json`).

DWF artifacts are, for example, task chains that orchestrate asynchronous
processes via the Data Warehouse Scheduler or data lifecycle profiles used for
data aging.

Note that in order to design or execute task chains the backend module must run.
Also note that a prerequisite for a data lifecycle profile definition is an
existing remote source that is defined in the HANA Cockpit.

For further DWF-related information, consult the
[SAP Help Portal](https://help.sap.com/viewer/product/SAP_HANA_DATA_WAREHOUSING_FOUNDATION/).
