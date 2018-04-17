// external modules
import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import InfoIcon from "react-icons/lib/fa/info-circle";

// custom modules
import Control from "components/Control";
import { sqlUtils } from "utils";
import { constraintActions } from "actions";

class DataSetControl extends Component {
   componentWillMount() {
      const tableNames = sqlUtils.getTableNames();
      this.setState({
         loading: false,
         tableNames
      });
   }

   constructor(props) {
      super(props);

      this.state = {
         loading: true,
         tableNames: []
      };
   }

   processTableNames() {
      let arr = [...this.state.tableNames];
      let final = [];

      for (let i = 0; i < arr.length; i += 2) {
         const tmp = [];
         if (arr[i]) tmp.push(arr[i]);
         if (arr[i + 1]) tmp.push(arr[i + 1]);
         final.push(tmp);
      }

      return final;
   }

   toggleTable(i, j) {
      const tableName = this.processTableNames()[i][j];
      this.props.toggleDataSet(tableName);
   }

   render() {
      return (
         <Control.Main
            className="DataSetControl"
            title="Data Overlays"
            icon={<InfoIcon />}
            helpText="Select data sets to be overlaid. Data sets that are not properly configured are disabled."
         >
            {this.state.loading && <div className="loader" />}
            {!this.state.loading &&
               !this.state.tableNames.length && (
                  <div className="block-warn">
                     No data sets have been uploaded yet.&nbsp;
                     <Link to="/data-upload">upload one</Link>
                  </div>
               )}
            {!!this.props.constraints.dataSets.length && (
               <div className="block-success">
                  <span className="bold">
                     {this.props.constraints.dataSets.length}
                  </span>&nbsp; data overlay(s) active
               </div>
            )}
            {!!this.state.tableNames.length && (
               <div className="data-sets-wrapper">
                  {this.processTableNames().map((group, i) => (
                     <div
                        key={i}
                        className="btn-group"
                        style={{ width: "100%" }}
                     >
                        {group.map((tableName, j) => {
                           const disabled = !sqlUtils.tableInfo.validity(
                              tableName
                           );
                           const classNames = ["btn"];
                           if (
                              this.props.constraints.dataSets.indexOf(
                                 tableName
                              ) !== -1
                           )
                              classNames.push("active");

                           return (
                              <button
                                 key={tableName}
                                 type="button"
                                 className={classNames.join(" ")}
                                 onClick={() => this.toggleTable(i, j)}
                                 disabled={disabled}
                              >
                                 {tableName}
                              </button>
                           );
                        })}
                     </div>
                  ))}
               </div>
            )}
         </Control.Main>
      );
   }
}

export default connect(({ constraints }) => ({ constraints }), {
   toggleDataSet: constraintActions.dataSets.toggle
})(DataSetControl);
