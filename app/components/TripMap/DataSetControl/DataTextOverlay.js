// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

// custom modules
import { TM_UNITS, RESOLUTION } from "utils/constants";
import { randomColor } from "utils";
import DataOverlayBlock from "./DataOverlayBlock";

class DataTextOverlay extends Component {
   static propTypes = {
      tableName: PropTypes.string.isRequired,
      otherColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
      timeColumn: PropTypes.string.isRequired,
      timeUnits: PropTypes.string.isRequired
   };

   constructor(props) {
      super(props);

      this.state = {
         color: randomColor()
      };
   }

   buildQuery() {
      const {
         tableName,
         otherColumns,
         timeUnits,
         timeColumn,
         constraints: { dateRange, snapshot }
      } = this.props;
      let baseQuery = `
			SELECT ${otherColumns.join(", ")}
				FROM ${tableName}
		`;

      const calcTime = tm => {
         switch (timeUnits) {
            case TM_UNITS.SECONDS.value:
               return tm.unix();
            case TM_UNITS.MILLIS.value:
               return tm.unix() * 1000;
            default:
               return tm;
         }
      };

      if (snapshot.active && dateRange.start && dateRange.end) {
         switch (snapshot.resolution) {
            case RESOLUTION.DAY:
               // gives the next matching timestamp
               baseQuery += `WHERE ${timeColumn} >= ${calcTime(
                  moment(dateRange.start).add(snapshot.slider, "day")
               )}`;
               break;
            case RESOLUTION.WEEK:
               baseQuery += `WHERE ${timeColumn} BETWEEN ${calcTime(
                  moment(dateRange.start).add(snapshot.slider, "week")
               )} AND ${calcTime(
                  moment(dateRange.start).add(snapshot.slider + 1, "week")
               )}`;
               break;
            case RESOLUTION.MONTH:
               const month = moment(dateRange.start).add(
                  snapshot.slider,
                  "month"
               );
               baseQuery += `WHERE ${timeColumn} BETWEEN ${calcTime(
                  month.startOf("month")
               )} AND ${calcTime(month.endOf("month"))}`;
               break;
         }
      } else if (dateRange.start && dateRange.end) {
         baseQuery += `WHERE ${timeColumn} BETWEEN ${calcTime(
            moment(dateRange.start)
         )} AND ${calcTime(moment(dateRange.end))}`;
      } else {
         return "";
      }
      return `
			${baseQuery}
			ORDER BY ${timeColumn} ASC
			LIMIT 1;
		`;
   }

   render() {
      const query = this.buildQuery();
      console.log(query);
      let columns, values;
      if (query) {
         const [content] = window.db.exec(query);
         if (content) {
            columns = content.columns;
            values = content.values[0];
         }
      }

      return (
         <DataOverlayBlock
            className="DataTextOverlay"
            header={`${this.props.tableName} data`}
            color={this.state.color}
         >
            {query &&
               columns &&
               columns.length &&
               values &&
               values.length &&
               this.props.otherColumns.map(col => {
                  return (
                     <p key={col}>
                        <span className="bold">{col}:</span>&nbsp;
                        {values[columns.indexOf(col)]}
                     </p>
                  );
               })}
            {query &&
               (!columns || !values) && (
                  <div className="block-warn">
                     No data was find for the given time restrictions.
                  </div>
               )}
            {!query && (
               <div className="block-error">
                  No time restrictions specified.
               </div>
            )}
         </DataOverlayBlock>
      );
   }
}

export default connect(({ constraints }) => ({ constraints }))(DataTextOverlay);
