// external modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import L from "leaflet";
import PinIcon from "react-icons/lib/fa/thumb-tack";
import HomeIcon from "react-icons/lib/fa/home";
import SaveIcon from "react-icons/lib/fa/floppy-o";

// custom modules
import Loading from "components/Loading";
import Notification from "components/Notification";
import GeofenceControl from "./GeofenceControl";
import TimeRestrictionControl from "./TimeRestrictionControl";
import TripInformationControl from "./TripInformationControl";
import AdvancedSettingsControl from "./AdvancedSettingsControl";
import VinControl from "./VinControl";
import { DataSetControl, DataOverlayMaster } from "./DataSetControl";
import MoreMenu from "./MoreMenu";
import { HEATMAP_GRADIENT, HEATMAP_DATA_TYPE } from "utils/constants";
import SaveCurrentMap from "./SaveCurrentMap";
import { constraintActions } from "actions";
import tripsData from "trips-data";
import { GraphMaster } from "./GraphMaster";
import fireEvent from "utils/fire-event";
import { MapTracker } from "utils";
import mapConfig from "../../../config/map-config.json";

// leaflet plugins
import "leaflet.heat";
import LeafletSlider from "../Leaflet.Slider";

class TripMap extends Component {
   componentWillMount() {
      fireEvent.registerEvent("map-updated");

      let state = {};

      tripsData.onChange((arrivalData, departureData) => {
         this.handleData(departureData, this.departureHeatmap, "departure");
         this.handleData(arrivalData, this.arrivalHeatmap, "arrival");
         fireEvent.fire("map-updated");
         this.setState({ ...state }, () => {
            state = {};
         });
      });

      window.socket.on("arrival data", ({ coordinates: data, info }) => {
         console.info("received (arrival):", new Date());
         tripsData.latencyManager.arrival.stop();
         tripsData.latencyManager.arrival.addPoint(info);
         if (state.departureData) {
            tripsData.updateData(data.concat(state.departureData));
         } else state.arrivalData = data;
      });

      window.socket.on("departure data", ({ coordinates: data, info }) => {
         console.info("received (departure):", new Date());
         tripsData.latencyManager.departure.stop();
         tripsData.latencyManager.departure.addPoint(info);
         if (state.arrivalData) {
            tripsData.updateData(data.concat(state.arrivalData));
         } else state.departureData = data;
      });
   }

   componentDidMount() {
      this.buildMap();
      this.buildMapComponents();
      this.setupMapTracker();
      this.props.refreshData();
   }

   // constructor
   constructor(props) {
      super(props);

      this.state = {
         showControls: true,
         arrivalNotification: null,
         departureNotification: null,
         data: []
      };
   }

   /**
    * Sets up the map tracker to track the zoom and bounds of the map
    * @return {[type]} [description]
    */
   setupMapTracker() {
      if (!this.map) return;

      const mapTracker = new MapTracker(this.map);

      mapTracker.registerCallback(MapTracker.EVENTS.ZOOM_END, () => {
         const zoom = this.map.getZoom();
      });

      mapTracker.registerCallback(MapTracker.EVENTS.MOVE_END, () => {
         const center = this.map.getCenter();
      });
   }

   /**
    * Handle the reception of data to the watched sockets (arrival and
    * departure data)
    * @param  {array} data     - the data received from the socker
    * @param  {object} heatmap - the heatmap to update
    * @param  {string} type    - the type of data to be handled
    */
   handleData(data, heatmap, type) {
      heatmap && heatmap.setLatLngs(data);

      this.setState({
         arrivalData: data,
         notification: !data.length
            ? {
                 type: "warning",
                 text: `No ${type} data was found for the given constraints`
              }
            : null
      });
   }

   // toggle the visibility of the control panel
   toggleControls() {
      this.setState({ showControls: !this.state.showControls });
   }

   // build the leaftlet map
   buildMap() {
      this.map = L.map("map-container");
      this.map.attributionControl.setPosition("bottomleft");
      this.map.setView([mapConfig.view_lat, mapConfig.view_lng], 12);
      this.forceUpdate();
   }

   // build the heatmap layer
   buildMapComponents() {
      this.arrivalHeatmap = L.heatLayer([], {
         radius: 15,
         minOpacity: 0.5,
         gradient: HEATMAP_GRADIENT.ARRIVAL
      }).addTo(this.map);

      this.departureHeatmap = L.heatLayer([], {
         radius: 15,
         minOpacity: 0.5,
         gradient: HEATMAP_GRADIENT.DEPARTURE
      }).addTo(this.map);

      this.overlaySlider = new LeafletSlider().addTo(this.map);
   }

   // render component
   render() {
      return (
         <div className="placemark-map">
            <div className="map-contents">
               {/* Leaflet map container */}
               <div id="map-container" />

               {/* Map is NOT ready */}
               {!this.map && <Loading text="Loading Map..." />}

               {/* Map is ready */}
               {this.map && (
                  <div className="map-contents">
                     {/* Notification */}
                     {this.state.departureNotification && (
                        <Notification
                           className="departure-notification"
                           text={this.state.departureNotification.text}
                           type={this.state.departureNotification.type}
                        />
                     )}
                     {this.state.arrivalNotification && (
                        <Notification
                           className="arrival-notification"
                           text={this.state.arrivalNotification.text}
                           type={this.state.arrivalNotification.type}
                        />
                     )}

                     {/* Control panel */}
                     {this.state.showControls && (
                        <div className="controls-wrapper">
                           <VinControl />
                           <GeofenceControl
                              map={this.map}
                              geofences={this.props.geofences}
                           />
                           <TimeRestrictionControl map={this.map} />
                           <TripInformationControl />
                           <AdvancedSettingsControl />
                           <DataSetControl />
                        </div>
                     )}

                     {/* Overlay Contents */}
                     <DataOverlayMaster map={this.map} />

                     {/* Control Toggle  */}
                     <div
                        className="toggle-controls no-image"
                        onClick={this.toggleControls.bind(this)}
                     >
                        <PinIcon className="dark-icon" size={21} />
                     </div>

                     {/* Homepage Link */}
                     <Link className="homepage-link" to="/">
                        <HomeIcon className="dark-icon" size={21} />
                     </Link>

                     {/* Additional Options */}
                     <MoreMenu map={this.map} />
                     <SaveCurrentMap
                        map={this.map}
                        overlaySlider={this.overlaySlider}
                     />

                     {/* Graph Master */}
                     <GraphMaster />
                  </div>
               )}
            </div>
         </div>
      );
   }
}

export default connect(
   ({ constraints }) => ({
      geofences: constraints.geofences
   }),
   {
      refreshData: constraintActions.refreshData
   }
)(TripMap);
