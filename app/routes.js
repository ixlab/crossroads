// external modules
import React from "react";
import { Route, IndexRoute, IndexRedirect } from "react-router";

// custom modules
import App from "components/App";
import Pivot from "components/Pivot";
import SocketTest from "components/SocketTest";
import TripMap from "components/TripMap";
import NotFound from "components/NotFound";
import Loading from "components/Loading";
import {
   DataUpload,
   ColumnSelection,
   TableConfiguration,
   DataProcessing,
   UploadComplete
} from "components/DataUpload";
import { DataSets, DataSetTable } from "components/DataSets";
import SetupApplication from "components/SetupApplication";
import ErrorOccurred from "components/ErrorOccurred";
import Navbar from "components/Navbar";
import store from "store";

const checkDataUpload = ({ location: { pathname: route } }, replace) => {
   if (!store.getState().dataUpload.data.length)
      replace("/data-upload/file-selection");
};

const setupApplication = (
   { location: { pathname: route, search: queryStrs } },
   replace
) => {
   const routesToSkip = ["/login", "/loading", "/uh-oh", "/setup"];
   if (!window.db && routesToSkip.indexOf(route) === -1)
      replace(`/setup?next=${route}${queryStrs}`);
};

export default (
   <Route path="/" component={App} onEnter={setupApplication}>
      <IndexRoute component={Pivot} />
      <Route path="setup" component={SetupApplication} />
      <Route path="socket-test" component={SocketTest} />
      <Route path="map">
         <IndexRedirect to="trips" />
         <Route path="trips" component={TripMap} />
      </Route>
      <Route path="data-upload" component={Navbar}>
         <IndexRedirect to="file-selection" />
         <Route path="file-selection" component={DataUpload} />
         <Route
            path="column-selection"
            component={ColumnSelection}
            onEnter={checkDataUpload}
         />
         <Route
            path="table-configuration"
            component={TableConfiguration}
            onEnter={checkDataUpload}
         />
         <Route
            path="processing"
            component={DataProcessing}
            onEnter={checkDataUpload}
         />
         <Route path="complete" component={UploadComplete} />
      </Route>
      <Route path="data-sets" component={Navbar}>
         <IndexRedirect to="dashboard" />
         <Route path="dashboard" component={DataSets} />
         <Route path="data-table" component={DataSetTable} />
      </Route>
      <Route path="loading" component={Loading} />
      <Route path="uh-oh" component={ErrorOccurred} />
      <Route path="*" component={NotFound} />
   </Route>
);
