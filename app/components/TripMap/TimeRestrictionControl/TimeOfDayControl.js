// external modules
import React, { Component } from "react";
import { Range } from "rc-slider";
import { connect } from "react-redux";
import throttle from "lodash.throttle";
import moment from "moment";
import DownCaret from "react-icons/lib/md/arrow-drop-down";

// custom modules
import Control from "components/Control";
import { constraintActions } from "actions";
import { TIME_OF_DAY, THROTTLE_THRES, PLAY_ANIM } from "utils/constants";
import fireEvent from "utils/fire-event";
import { CompanionButton } from "components/Buttons";

class TimeOfDayControl extends Component {
   constructor(props) {
      super(props);

      this.thottledUpdateArrivalTimeOfDay = throttle(
         this.props.updateArrivalTimeOfDay,
         THROTTLE_THRES
      );
      this.thottledUpdateDepartureTimeOfDay = throttle(
         this.props.updateDepartureTimeOfDay,
         THROTTLE_THRES
      );

      this.goToNextFrameForArrival = this.buildGoToNextFrame(
         TIME_OF_DAY.ARRIVAL
      ).bind(this);
      this.goToNextFrameForDeparture = this.buildGoToNextFrame(
         TIME_OF_DAY.DEPARTURE
      ).bind(this);

      this.handleArrivalPlayClick = this.buildHandlePlayClick(
         TIME_OF_DAY.ARRIVAL
      ).bind(this);
      this.handleDeparturePlayClick = this.buildHandlePlayClick(
         TIME_OF_DAY.DEPARTURE
      ).bind(this);

      this.state = {
         isPlayingArrival: false,
         isPlayingDeparture: false,
         arrivalSpeed: PLAY_ANIM.MIN_WAIT,
         departureSpeed: PLAY_ANIM.MIN_WAIT
      };
   }

   /**
    * Get and format a given time.
    * @param {number} time - a number between 0-23 where 0 is 12:00AM and 23 is 11:59PM
    * @returns {string} the formatted time
    */
   formatTime(time) {
      if (time === 0) return "12:00 AM";
      else if (time < 12) return `${time}:00 AM`;
      else if (time === 12) return "12:00 PM";
      else if (time < 24) return `${time - 12}:00 PM`;
      else return "11:59 PM";
   }

   buildGoToNextFrame(type) {
      let update, callback, stateKey;

      switch (type) {
         case TIME_OF_DAY.DEPARTURE:
            update = this.props.updateDepartureTimeOfDay;
            callback = this.goToNextFrameForDeparture;
            stateKey = "isPlayingDeparture";
            break;
         case TIME_OF_DAY.ARRIVAL:
            update = this.props.updateArrivalTimeOfDay;
            callback = this.goToNextFrameForArrival;
            stateKey = "isPlayingArrival";
            break;
      }

      return function() {
         const max = 24;
         const minWait =
            type === TIME_OF_DAY.ARRIVAL
               ? this.state.arrivalSpeed
               : this.state.departureSpeed;

         setTimeout(() => {
            let [start, end] = this.props.constraints.timeOfDay[type];

            if (end >= max || !this.state[stateKey]) {
               fireEvent.removeCallback("map-updated", callback);
               this.setState({ [stateKey]: false });
            } else {
               update([start + 1, end + 1]);
            }
         }, minWait);
      };
   }

   buildHandlePlayClick(type) {
      let callback, stateKey;

      switch (type) {
         case TIME_OF_DAY.DEPARTURE:
            callback = this.goToNextFrameForDeparture;
            stateKey = "isPlayingDeparture";
            break;
         case TIME_OF_DAY.ARRIVAL:
            callback = this.goToNextFrameForArrival;
            stateKey = "isPlayingArrival";
            break;
      }

      return function() {
         if (this.state[stateKey]) {
            fireEvent.removeCallback("map-updated", callback);
         } else {
            fireEvent.registerCallback("map-updated", callback);
            callback();
         }

         this.setState({ [stateKey]: !this.state[stateKey] });
      };
   }

   onCompanionSelect(selection, type) {
      switch (type) {
         case TIME_OF_DAY.ARRIVAL:
            this.setState({ arrivalSpeed: selection.value });
            break;
         case TIME_OF_DAY.DEPARTURE:
            this.setState({ departureSpeed: selection.value });
            break;
      }
   }

   render() {
      return (
         <Control.Sub className="TimeOfDayControl" title="Time of Day">
            <Control.SuperSub className="arrival-time" title="Arrival Time">
               <Range
                  className="time-slider"
                  max={24}
                  value={this.props.constraints.timeOfDay.arrival}
                  onChange={this.thottledUpdateArrivalTimeOfDay.bind(this)}
               />
               <div className="text-content">
                  <p className="text-center">
                     Arrived between&nbsp;
                     <span className="bold">
                        {this.formatTime(
                           this.props.constraints.timeOfDay.arrival[0]
                        )}
                     </span>
                     &nbsp;and&nbsp;
                     <span className="bold">
                        {this.formatTime(
                           this.props.constraints.timeOfDay.arrival[1]
                        )}
                     </span>
                  </p>
               </div>
               <div className="btn-group">
                  <CompanionButton
                     disabled={this.state.isPlayingDeparture}
                     buttonText={this.state.isPlayingArrival ? "Stop" : "Play"}
                     companionIcon={
                        <DownCaret size={20} className="dark-icon" />
                     }
                     onClick={this.handleArrivalPlayClick.bind(this)}
                     onCompanionSelect={selection =>
                        this.onCompanionSelect(selection, TIME_OF_DAY.ARRIVAL)
                     }
                     companionOptions={[
                        { value: 100, label: "Fast (10 fps)" },
                        { value: 250, label: "Regular (4 fps)" },
                        { value: 1000, label: "Slow (1 fps)" }
                     ]}
                  />
                  <button type="button" className="btn" disabled={true}>
                     Download
                  </button>
               </div>
            </Control.SuperSub>
            <Control.SuperSub className="departure-time" title="Departure Time">
               <Range
                  className="time-slider"
                  max={24}
                  value={this.props.constraints.timeOfDay.departure}
                  onChange={this.thottledUpdateDepartureTimeOfDay.bind(this)}
               />
               <div className="text-content">
                  <p className="text-center">
                     Departed between&nbsp;
                     <span className="bold">
                        {this.formatTime(
                           this.props.constraints.timeOfDay.departure[0]
                        )}
                     </span>
                     &nbsp;and&nbsp;
                     <span className="bold">
                        {this.formatTime(
                           this.props.constraints.timeOfDay.departure[1]
                        )}
                     </span>
                  </p>
               </div>
               <div className="btn-group">
                  <CompanionButton
                     disabled={this.state.isPlayingArrival}
                     buttonText={
                        this.state.isPlayingDeparture ? "Stop" : "Play"
                     }
                     companionIcon={
                        <DownCaret size={20} className="dark-icon" />
                     }
                     onClick={this.handleDeparturePlayClick.bind(this)}
                     onCompanionSelect={selection =>
                        this.onCompanionSelect(selection, TIME_OF_DAY.DEPARTURE)
                     }
                     companionOptions={[
                        { value: 100, label: "Fast (10 fps)" },
                        { value: 250, label: "Regular (4 fps)" },
                        { value: 1000, label: "Slow (1 fps)" }
                     ]}
                  />
                  <button type="button" className="btn" disabled={true}>
                     Download
                  </button>
               </div>
            </Control.SuperSub>
         </Control.Sub>
      );
   }
}

export default connect(({ constraints }) => ({ constraints }), {
   updateArrivalTimeOfDay: constraintActions.timeOfDay.arrival.update,
   updateDepartureTimeOfDay: constraintActions.timeOfDay.departure.update
})(TimeOfDayControl);
