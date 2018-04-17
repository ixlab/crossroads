// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";

// custom modules
import Control from "components/Control";
import DateRangeControl from "./DateRangeControl";
import SnapshotControl from "./SnapshotControl.v2";
import TimeOfDayControl from "./TimeOfDayControl";
import DayOfWeekControl from "./DayOfWeekControl";

export default class TimeRestrictionControl extends Component {
   static propTypes = {
      map: PropTypes.object.isRequired
   };

   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Control.Main
            className="TimeRestrictionControl"
            title="Time Restrictions"
         >
            <DateRangeControl />
            <SnapshotControl map={this.props.map} />
            <TimeOfDayControl />
            <DayOfWeekControl />
         </Control.Main>
      );
   }
}
