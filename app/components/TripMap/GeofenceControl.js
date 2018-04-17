// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FreeDraw, {
   ALL,
   NONE
} from "components/Leaflet.Freedraw/leaflet-freedraw.cjs.js";
import InfoIcon from "react-icons/lib/fa/info-circle";

// custom modules
import Control from "components/Control";
import { constraintActions } from "actions";
import { POLYGON_CLASS_NAMES } from "./map-utils.js";

// FIXME: sometimes way too many calls are made to the API; only
// happens when manipulating points, and seems to be related to
// the number of polygons on the map

class GeofenceControl extends Component {
   componentWillMount() {
      this.freeDraw = new FreeDraw({
         mode: NONE,
         smoothFactor: 0.3,
         simplifyFactor: 0.95,
         mergePolygons: false
      }).addTo(this.props.map);
      this.freeDraw.on("markers", this.fenceDrawn.bind(this));

      this.freeDraw.polygonClassNames([POLYGON_CLASS_NAMES.INBOUND]);
      this.props.geofences.arrivedAt.length &&
         this.freeDraw.create(this.props.geofences.arrivedAt[0]);

      this.freeDraw.polygonClassNames([POLYGON_CLASS_NAMES.OUTBOUND]);
      this.props.geofences.departedFrom.length &&
         this.freeDraw.create(this.props.geofences.departedFrom[0]);
   }

   componentDidUpdate(prevProps, prevState) {
      if (!this.state.inboundActive && !this.state.outboundActive)
         this.freeDraw.mode(NONE);
   }

   constructor(props) {
      super(props);

      this.state = {
         inboundActive: false,
         outboundActive: false
      };
   }

   /**
    * Is invoked everytime the fences change (addition or removal).
    * @param {object} e - the fence drawn event fired by Leaflet.FreeDraw
    */
   fenceDrawn(e) {
      const inbound = [];
      const outbound = [];

      this.freeDraw
         .all()
         .forEach(
            ({
               options: { polygonClassNames: [className] },
               _latlngs: [polygon]
            }) => {
               if (className === POLYGON_CLASS_NAMES.INBOUND)
                  inbound.push(polygon);
               else if (className === POLYGON_CLASS_NAMES.OUTBOUND)
                  outbound.push(polygon);
            }
         );

      if (!inbound.length && !outbound.length) this.props.clearAllGeofences();
      else this.props.updateAllGeofences(inbound, outbound);
   }

   clearGeofences() {
      this.freeDraw.clear();
   }

   toggleInbound() {
      this.freeDraw.mode(ALL);
      this.freeDraw.polygonClassNames([POLYGON_CLASS_NAMES.INBOUND]);
      this.setState({
         inboundActive: !this.state.inboundActive,
         outboundActive: false
      });
   }

   toggleOutbound() {
      this.freeDraw.mode(ALL);
      this.freeDraw.polygonClassNames([POLYGON_CLASS_NAMES.OUTBOUND]);
      this.setState({
         outboundActive: !this.state.outboundActive,
         inboundActive: false
      });
   }

   undoGeofence() {
      console.log("undo geofence");
   }

   redoGeofence() {
      console.log("redo geofence");
   }

   render() {
      const inboundBtnClassNames = ["btn", "btn-alternate", "no-margin-top"];
      const outboundBtnClassNames = ["btn", "btn-danger", "no-margin-top"];

      this.state.inboundActive && inboundBtnClassNames.push("active");
      this.state.outboundActive && outboundBtnClassNames.push("active");

      return (
         <Control.Main
            className="GeofenceControl"
            title="Geofences"
            icon={<InfoIcon />}
            helpText="When drawing is enabled, you can freely draw shapes and tap to remove them."
            undoAction={this.undoGeofence.bind(this)}
            redoAction={this.redoGeofence.bind(this)}
         >
            <div className="btn-group">
               <button
                  className={inboundBtnClassNames.join(" ")}
                  onClick={this.toggleInbound.bind(this)}
               >
                  Arrival
               </button>
               <button
                  className={outboundBtnClassNames.join(" ")}
                  onClick={this.toggleOutbound.bind(this)}
               >
                  Departure
               </button>
               <button
                  className="btn no-margin-right no-margin-top"
                  onClick={this.clearGeofences.bind(this)}
               >
                  Clear
               </button>
            </div>
         </Control.Main>
      );
   }
}

GeofenceControl.propTypes = {
   map: PropTypes.object
};

export default connect(({ constraints }) => ({ constraints }), {
   updateAllGeofences: constraintActions.geofences.all.update,
   clearAllGeofences: constraintActions.geofences.all.clear,
   updateInboundGeofences: constraintActions.geofences.inbound.update,
   updateOutboundGeofences: constraintActions.geofences.outbound.update
})(GeofenceControl);
