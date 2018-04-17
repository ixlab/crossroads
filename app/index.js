// third-party modules
import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from "react-router";
import { Provider } from "react-redux";

// custom modules
import routes from "routes";
import store from "store";

// custom styles
import "stylesheet";

// vendor styles
import "rc-slider/assets/index.css";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "components/Leaflet.Slider/leaflet-slider.css";
import "mapbox-gl/dist/mapbox-gl.css";

ReactDOM.render(
   <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
   </Provider>,
   document.getElementById("root")
);
