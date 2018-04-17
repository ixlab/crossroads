// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "react-icons/lib/fa/trash";
import UndoIcon from "react-icons/lib/md/undo";
import DataIcon from "react-icons/lib/fa/table";
import SettingsIcon from "react-icons/lib/fa/cogs";

// custom modules
import { toSnakeCase, sqlUtils } from "utils";
import { TM_UNITS } from "utils/constants";
import SimpleSelect from "components/SimpleSelect";

class TableCell extends Component {
   static contextTypes = { router: PropTypes.object };

   componentWillMount() {
      this.updateTableData();
   }

   updateTableData(params = {}) {
      const { tableName } = this.props;
      const state = {
         done: true,
         ...params
      };

      const sampleContent = window.db.exec(
         `SELECT * FROM ${tableName} LIMIT 3`
      )[0];
      const rowContent = window.db.exec(
         `SELECT COUNT(*) FROM ${tableName};`
      )[0];
      const tableInfo = this.parseTableInfo(sqlUtils.tableInfo.info(tableName));

      state.rows = rowContent.values[0][0];
      state.cols = sampleContent.columns;
      state.tableInfo = tableInfo;

      this.setState(state);
   }

   constructor(props) {
      super(props);

      this.state = {
         editing: false,
         done: false,
         rows: null,
         cols: null,
         tableInfo: {},
         updateColumn: "",
         updateValue: "",
         updating: false,
         successMessage: "",
         errorMessage: ""
      };
   }

   updateColumnChanged({ target: { value: updateColumn } }) {
      this.setState({ updateColumn });
   }

   updateValueChanged({ target: { value: updateValue } }) {
      this.setState({ updateValue });
   }

   parseTableInfo(tableInfo) {
      // 2 to ignore `id` and `table_name`
      const START_OFFSET = 2;

      // 1 to ignore `other_columns`
      const END_OFFSET = 1;

      if (
         tableInfo.values &&
         tableInfo.values.length > START_OFFSET &&
         tableInfo.columns &&
         tableInfo.columns.length > START_OFFSET
      ) {
         const { values: vals, columns: cols } = tableInfo;
         const res = [];

         vals
            .slice(START_OFFSET, vals.length - END_OFFSET)
            .forEach((val, i) => {
               if (val) res.push({ col: cols[i + START_OFFSET], val });
            });

         return res;
      } else {
         return [];
      }
   }

   editTableInfo() {
      this.setState({ editing: !this.state.editing });
   }

   showData() {
      this.context.router.push(
         `/data-sets/data-table?table_name=${this.props.tableName}`
      );
   }

   deleteTable() {
      this.props.flagForDeletion(this.props.tableName);
   }

   submitUpdate() {
      const { updateColumn, updateValue } = this.state;

      this.setState({ updating: true });

      setTimeout(() => {
         sqlUtils.tableInfo.update(
            this.props.tableName,
            updateColumn,
            updateValue
         );
         sqlUtils.tableInfo
            .updateRemote()
            .then(res => {
               this.updateTableData({
                  updating: false,
                  editing: false,
                  updateColumn: "",
                  updateValue: "",
                  successMessage: `${updateColumn} for ${
                     this.props.tableName
                  } has been updated to ${updateValue}.`
               });
            })
            .catch(err => {
               this.updateTableData({
                  updating: false,
                  editing: false,
                  updateColumn: "",
                  updateValue: "",
                  successMessage: `${updateColumn} for ${
                     this.props.tableName
                  } has been updated to ${updateValue}.`
               });
            });
      }, 500);
   }

   render() {
      const classNames = ["table-wrapper"];
      if (this.props.className) classNames.push(this.props.className);

      const editClassNames = ["btn"];
      if (this.state.editing) editClassNames.push("active");

      return (
         <div className={classNames.join(" ")}>
            <h3 className="text-center">{this.props.tableName}</h3>
            {this.state.done ? (
               <div className="table-content">
                  <div className="info-content">
                     <div className="info-content-col">
                        <p>
                           <span className="bold">Row Count:</span>&nbsp;
                           {this.state.rows}
                        </p>
                        <p>
                           <span className="bold">Columns:</span>&nbsp;
                           {this.state.cols.join(", ")}
                        </p>
                     </div>
                     <div className="info-content-col">
                        {!this.state.tableInfo.length && (
                           <div className="block-error">
                              This table is not properly configured.
                           </div>
                        )}
                        {this.state.tableInfo.map(info => (
                           <p key={info.col}>
                              <span className="bold">
                                 {toSnakeCase(info.col)}:
                              </span>&nbsp;
                              {info.val}
                           </p>
                        ))}
                     </div>
                  </div>
                  <div className="btn-group">
                     <button
                        type="button"
                        className="btn"
                        onClick={this.showData.bind(this)}
                     >
                        <DataIcon size={18} className="dark-icon" />&nbsp; Show
                        Data
                     </button>
                     <button
                        type="button"
                        className={editClassNames.join(" ")}
                        onClick={this.editTableInfo.bind(this)}
                     >
                        <SettingsIcon size={18} className="dark-icon" />&nbsp;
                        Edit Table
                     </button>
                     {this.props.className &&
                     this.props.className.indexOf("flagged-for-deletion") !==
                        -1 ? (
                        <button
                           type="button"
                           className="btn"
                           onClick={this.deleteTable.bind(this)}
                        >
                           <UndoIcon size={18} className="dark-icon" />&nbsp;
                           Undo
                        </button>
                     ) : (
                        <button
                           type="button"
                           className="btn btn-danger"
                           onClick={this.deleteTable.bind(this)}
                        >
                           <DeleteIcon size={18} className="dark-icon" />&nbsp;
                           Delete
                        </button>
                     )}
                  </div>
               </div>
            ) : (
               <div className="loader" />
            )}
            {this.state.successMessage && (
               <div className="block-success">{this.state.successMessage}</div>
            )}
            {this.state.errorMessage && (
               <div className="block-err">{this.state.errorMessage}</div>
            )}
            {this.state.editing && (
               <div className="edit-table-content">
                  <h4>Edit Table</h4>
                  <hr className="reg-spacer" />
                  <div className="form-control flat-input">
                     <SimpleSelect
                        options={sqlUtils.tableInfo.COLUMNS}
                        style={{ flex: "1 1 0", marginRight: "15px" }}
                        onChange={this.updateColumnChanged.bind(this)}
                     />
                     <SimpleSelect
                        options={
                           this.state.updateColumn === "time_units"
                              ? Object.values(TM_UNITS)
                              : this.state.cols
                        }
                        style={{ flex: "1 1 0" }}
                        onChange={this.updateValueChanged.bind(this)}
                     />
                  </div>
                  {!this.state.updating && (
                     <div className="btn-group">
                        <button
                           type="button"
                           className="btn"
                           disabled={!this.state.updateColumn}
                           onClick={this.submitUpdate.bind(this)}
                        >
                           Update
                        </button>
                     </div>
                  )}
                  {this.state.updating && <div className="loader" />}
               </div>
            )}
         </div>
      );
   }
}

TableCell.propTypes = {
   tableName: PropTypes.string.isRequired,
   flagForDeletion: PropTypes.func.isRequired,
   className: PropTypes.string
};

export default TableCell;
