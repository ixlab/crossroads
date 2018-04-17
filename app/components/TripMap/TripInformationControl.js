// external modules
import React, { Component } from "react";
import { Range } from "rc-slider";
import { connect } from "react-redux";
import throttle from "lodash.throttle";

// custom modules
import Control from "components/Control";
import { constraintActions } from "actions";
import { tripInformationSliderConfig as sliderConfig } from "../../../config/query-config.json";
import { THROTTLE_THRES } from "utils/constants";

class TripInformationControl extends Component {
   constructor(props) {
      super(props);

      this.throttledUpdateTripDistance = throttle(
         this.props.updateTripDistance,
         THROTTLE_THRES
      );
      this.throttledUpdateTripTime = throttle(
         this.props.updateTripTime,
         THROTTLE_THRES
      );
   }

   /**
    * Get and format a given time.
    * @param {number} time - a number representing minutes
    * @returns {string} the formatted time
    */
   formatTime(time) {
      return (time >= sliderConfig.maxTime ? ">" : "") + `${time} min`;
   }

   /**
    * Get and format a given distance.
    * @param {number} dist - a number representing kilometers
    * @returns {string} the formatted distance
    */
   formatDistance(dist) {
      return (dist >= sliderConfig.maxDistance ? ">" : "") + `${dist} km`;
   }

   render() {
      return (
         <Control.Main
            className="TripInformationControl"
            title="Trip Information"
         >
            {/* Trip Time */}
            <Control.Sub
               className="TripInformation--block trip-time"
               title="Trip Time"
            >
               <Range
                  className="time-slider"
                  max={Math.floor(sliderConfig.maxTime)}
                  value={this.props.constraints.tripTime}
                  onChange={this.throttledUpdateTripTime.bind(this)}
               />
               <div className="text-content">
                  <p className="text-center">
                     Trip time between&nbsp;
                     <span className="bold">
                        {this.formatTime(this.props.constraints.tripTime[0])}
                     </span>
                     &nbsp;and&nbsp;
                     <span className="bold">
                        {this.formatTime(this.props.constraints.tripTime[1])}
                     </span>
                  </p>
               </div>
            </Control.Sub>

            {/* Trip Distance */}
            <Control.Sub
               className="TripInformation--block trip-distance"
               title="Trip Distance"
            >
               <Range
                  className="time-slider"
                  max={Math.floor(sliderConfig.maxDistance)}
                  value={this.props.constraints.tripDistance}
                  onChange={this.throttledUpdateTripDistance.bind(this)}
               />
               <div className="text-content">
                  <p className="text-center">
                     Trip distance between&nbsp;
                     <span className="bold">
                        {this.formatDistance(
                           this.props.constraints.tripDistance[0]
                        )}
                     </span>
                     &nbsp;and&nbsp;
                     <span className="bold">
                        {this.formatDistance(
                           this.props.constraints.tripDistance[1]
                        )}
                     </span>
                  </p>
               </div>
            </Control.Sub>
         </Control.Main>
      );
   }
}

export default connect(({ constraints }) => ({ constraints }), {
   updateTripTime: constraintActions.tripTime.update,
   updateTripDistance: constraintActions.tripDistance.update
})(TripInformationControl);
