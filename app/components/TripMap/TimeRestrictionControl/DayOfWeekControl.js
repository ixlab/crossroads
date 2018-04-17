// external modules
import React, { Component } from "react";
import { connect } from "react-redux";

// custom modules
import Control from "components/Control";
import { constraintActions } from "actions";

const DAYS_OF_WEEK = [
   { label: "Mn", key: 0 },
   { label: "Tu", key: 1 },
   { label: "Wd", key: 2 },
   { label: "Th", key: 3 },
   { label: "Fr", key: 4 },
   { label: "Sa", key: 5 },
   { label: "Su", key: 6 }
];

class DayOfWeekControl extends Component {
   // update selection to weekdays
   selectWeekdays() {
      this.props.updateDayOfWeek([0, 1, 2, 3, 4]);
   }

   // update selection to weekends
   selectWeekends() {
      this.props.updateDayOfWeek([5, 6]);
   }

   render() {
      return (
         <Control.Sub className="DayOfWeekControl" title="Day of Week">
            <div className="block-selection">
               {DAYS_OF_WEEK.map(day => {
                  const classNames = ["dow-block"];
                  this.props.constraints.dayOfWeek.indexOf(day.key) !== -1 &&
                     classNames.push("active");
                  return (
                     <div
                        key={day.key}
                        className={classNames.join(" ")}
                        onClick={() => this.props.toggleDayOfWeek(day.key)}
                     >
                        {day.label}
                     </div>
                  );
               })}
            </div>
            <div className="btn-group">
               <div
                  className="btn text-center"
                  onClick={this.selectWeekdays.bind(this)}
               >
                  Weekdays
               </div>
               <div
                  className="btn text-center"
                  onClick={this.selectWeekends.bind(this)}
               >
                  Weekends
               </div>
               <div
                  className="btn text-center no-margin-right"
                  onClick={this.props.clearDayOfWeek.bind(this)}
               >
                  Clear
               </div>
            </div>
         </Control.Sub>
      );
   }
}

export default connect(({ constraints }) => ({ constraints }), {
   clearDayOfWeek: constraintActions.dayOfWeek.clear,
   toggleDayOfWeek: constraintActions.dayOfWeek.toggle,
   updateDayOfWeek: constraintActions.dayOfWeek.update
})(DayOfWeekControl);
