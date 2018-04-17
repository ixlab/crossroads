// external modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { DateRangePicker } from "react-dates";
import moment from "moment";

// custom modules
import Control from "components/Control";
import { constraintActions } from "actions";

class DateRangeControl extends Component {
   constructor(props) {
      super(props);

      this.state = { focusedInput: null };
   }

   onDatesChange({ startDate, endDate }) {
      if (!startDate && !endDate) return this.props.clearDates();

      let {
         start: prevStartDate,
         end: prevEndDate
      } = this.props.constraints.dateRange;

      prevStartDate = moment(prevStartDate);
      startDate = moment(startDate);

      prevEndDate = moment(prevEndDate);
      endDate = moment(endDate);

      if (
         (!prevStartDate.isValid() && startDate.isValid()) ||
         (prevStartDate.isValid() && !prevStartDate.isSame(startDate))
      )
         this.props.updateStartDate(startDate);

      if (
         (!prevEndDate.isValid() && endDate.isValid()) ||
         (prevEndDate.isValid() && !prevEndDate.isSame(endDate))
      )
         this.props.updateEndDate(endDate);
   }

   onFocusChange(focusedInput) {
      this.setState({ focusedInput });
   }

   render() {
      return (
         <Control.Sub className="DateRangeControl" title="Date Range">
            <DateRangePicker
               numberOfMonths={1}
               showClearDates={true}
               showDefaultInputIcon={true}
               hideKeyboardShortcutsPanel={true}
               startDate={this.props.constraints.dateRange.start}
               endDate={this.props.constraints.dateRange.end}
               onDatesChange={this.onDatesChange.bind(this)}
               focusedInput={this.state.focusedInput}
               onFocusChange={this.onFocusChange.bind(this)}
               isOutsideRange={() => false}
            />
         </Control.Sub>
      );
   }
}

export default connect(({ constraints }) => ({ constraints }), {
   clearDates: constraintActions.dateRange.all.clear,
   updateStartDate: constraintActions.dateRange.start.update,
   updateEndDate: constraintActions.dateRange.end.update
})(DateRangeControl);
