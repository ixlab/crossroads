// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// custom modules
import { sqlUtils } from "utils";
import { TM_UNITS } from "utils/constants";
import Jumbotron from "components/Jumbotron";
import SimpleSelect from "components/SimpleSelect";
import { dataUploadActions } from "actions";

class TableConfiguration extends Component {
   static contextTypes = { router: PropTypes.object };

   constructor(props) {
      super(props);

      const tableNames = sqlUtils.tableInfo.all.names();

      this.state = {
         tableNames,
         errorMessage: this.checkNameForErrors(
            this.props.dataUpload.tableConfig.tableName,
            tableNames
         )
      };
   }

   checkNameForErrors(name, tableNames) {
      tableNames = tableNames || this.state.tableNames || [];
      let error;
      if (!/^[A-Za-z\_]+$/.test(name))
         error = "Table name can only contain letters and underscores";
      if (tableNames.indexOf(name) !== -1) error = "Table name already exists";
      return error;
   }

   goBack() {
      this.context.router.push("/data-upload/column-selection");
   }

   goNext() {
      this.context.router.push("/data-upload/processing");
   }

   tableNameChanged({ target: { value: tableName } }) {
      this.props.updateTableConfig({ tableName });
      this.setState({ errorMessage: this.checkNameForErrors(tableName) });
   }

   updateTableConfig(key, value) {
      this.props.updateTableConfig({ [key]: value });
   }

   render() {
      // only use the column names that haven't been ignored
      // for the selects
      const { dataUpload: { ignored = [] } } = this.props;
      let columnNames = Object.keys(this.props.dataUpload.data[0]);
      if (ignored.length)
         columnNames = columnNames.filter(col => ignored.indexOf(col) === -1);

      return (
         <Jumbotron.Scrollable
            header="Data Configuration"
            subheader="Change the following configuration data as needed."
         >
            <div className="data-configuration-wrapper">
               <div className="configuration-section">
                  <h4>Data Set Information</h4>
                  <label>Data Set Name:</label>
                  <div className="form-control flat-input">
                     <input
                        type="text"
                        value={this.props.dataUpload.tableConfig.tableName}
                        style={{ marginRight: "0" }}
                        onChange={this.tableNameChanged.bind(this)}
                     />
                  </div>
                  {this.state.errorMessage && (
                     <div className="block-error">
                        {this.state.errorMessage}
                     </div>
                  )}
               </div>
               <div className="configuration-section">
                  <h4 style={{ marginTop: "25px" }}>Column Information</h4>
                  <label>Time Column:</label>
                  <div className="form-control flat-input">
                     <SimpleSelect
                        value={this.props.dataUpload.tableConfig.timeColumn}
                        style={{ marginRight: "15px" }}
                        options={columnNames}
                        onChange={({ target: { value } }) =>
                           this.updateTableConfig("timeColumn", value)
                        }
                     />
                     <select
                        value={
                           this.props.dataUpload.tableConfig.timeUnits ||
                           TM_UNITS.SECONDS.value
                        }
                        onChange={({ target: { value } }) =>
                           this.updateTableConfig("timeUnits", value)
                        }
                     >
                        {Object.values(TM_UNITS).map(unit => (
                           <option key={unit.value} value={unit.value}>
                              {unit.label}
                           </option>
                        ))}
                     </select>
                  </div>
                  <label style={{ display: "block", marginTop: "10px" }}>
                     Polygon Column:
                  </label>
                  <div className="form-control flat-input">
                     <SimpleSelect
                        value={this.props.dataUpload.tableConfig.polygonColumn}
                        style={{ marginRight: "0" }}
                        options={columnNames}
                        onChange={({ target: { value } }) =>
                           this.updateTableConfig("polygonColumn", value)
                        }
                     />
                  </div>
                  <label style={{ display: "block", marginTop: "10px" }}>
                     Polyline Column:
                  </label>
                  <div className="form-control flat-input">
                     <SimpleSelect
                        value={this.props.dataUpload.tableConfig.polylineColumn}
                        style={{ marginRight: "0" }}
                        options={columnNames}
                        onChange={({ target: { value } }) =>
                           this.updateTableConfig("polylineColumn", value)
                        }
                     />
                  </div>
                  <label style={{ display: "block", marginTop: "10px" }}>
                     Coordinates Columns (latitude, longitude):
                  </label>
                  <div className="form-control flat-input">
                     <SimpleSelect
                        value={this.props.dataUpload.tableConfig.latitudeColumn}
                        style={{ marginRight: "15px" }}
                        options={columnNames}
                        onChange={({ target: { value } }) =>
                           this.updateTableConfig("latitudeColumn", value)
                        }
                     />
                     <SimpleSelect
                        value={
                           this.props.dataUpload.tableConfig.longitudeColumn
                        }
                        style={{ marginRight: "0" }}
                        options={columnNames}
                        onChange={({ target: { value } }) =>
                           this.updateTableConfig("longitudeColumn", value)
                        }
                     />
                  </div>
               </div>
            </div>
            <div className="btn-group" style={{ width: "100%" }}>
               <button
                  type="button"
                  className="btn"
                  style={{ width: "50%" }}
                  onClick={this.goBack.bind(this)}
               >
                  Back
               </button>
               <button
                  type="button"
                  className="btn no-margin-right"
                  style={{ width: "50%" }}
                  disabled={
                     !this.props.dataUpload.tableConfig.tableName ||
                     this.state.errorMessage
                  }
                  onClick={this.goNext.bind(this)}
               >
                  Finish
               </button>
            </div>
         </Jumbotron.Scrollable>
      );
   }
}

export default connect(({ dataUpload }) => ({ dataUpload }), {
   updateTableConfig: dataUploadActions.tableConfig.update
})(TableConfiguration);
