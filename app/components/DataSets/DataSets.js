// external modules
import React, { Component } from "react";
import { Link } from "react-router";
import axios from "axios";

// custom modules
import TableCell from "./TableCell";
import { sqlUtils } from "utils";

class DataSets extends Component {
   constructor(props) {
      super(props);

      this.state = {
         successMessage: "",
         errorMessage: "",
         loading: false,
         hasData: !!window.db && sqlUtils.tableInfo.all.names().length,
         deletions: []
      };
   }

   saveChanges() {
      this.setState({ loading: true });
      Promise.all(
         this.state.deletions.map(tableName =>
            sqlUtils.tableInfo.drop(tableName)
         )
      )
         .then(res => {
            axios
               .post("/api/data-upload/upload-sqlite", {
                  // TODO: update this based on the user
                  filename: "sql.db",
                  data: window.db.export()
               })
               .then(res => {
                  this.setState({
                     loading: false,
                     deletions: [],
                     successMessage: `Successfully removed table(s): ${this.state.deletions.join(
                        ", "
                     )}`
                  });
               })
               .catch(err => {
                  console.error(err);
                  this.setState({
                     loading: false,
                     errorMessage: `Unable to remove table(s): ${this.state.deletions.join(
                        ", "
                     )}`
                  });
               });
         })
         .catch(err => {
            /*
					NOTE: some of the tables may not have been successfully deleted; this is a 
					weird scenario. Could check to see what table names are still in
					`table_info` and compare agains `this.state.deletions`
				*/
            this.setState({
               loading: false,
               errorMessage: `Unable to remove table(s): ${this.state.deletions.join(
                  ", "
               )}`
            });
         });
   }

   cancel() {
      this.setState({ deletions: [] });
   }

   flagForDeletion(tableName) {
      if (this.state.deletions.indexOf(tableName) !== -1)
         this.setState({
            deletions: this.state.deletions.filter(
               _tableName => _tableName !== tableName
            )
         });
      else this.setState({ deletions: [...this.state.deletions, tableName] });
   }

   render() {
      return (
         <div className="jumbotron">
            {this.state.hasData ? (
               <div className="jumbotron-scrollable">
                  <div
                     className="jumbotron-content"
                     style={{ maxWidth: "700px" }}
                  >
                     <h2>Data Sets</h2>
                     <hr className="reg-spacer" />
                     <p>
                        Manage all currently available user-uploaded datasets.
                     </p>
                     {this.state.successMessage && (
                        <div className="block-success">
                           {this.state.successMessage}
                        </div>
                     )}
                     {this.state.errorMessage && (
                        <div className="block-error">
                           {this.state.errorMessage}
                        </div>
                     )}
                     <div className="data-set-wrapper">
                        {sqlUtils.tableInfo.all.names().map(tableName => {
                           const props = {
                              key: tableName,
                              tableName,
                              flagForDeletion: this.flagForDeletion.bind(this)
                           };

                           if (this.state.deletions.indexOf(tableName) !== -1)
                              props.className = "flagged-for-deletion";

                           return <TableCell {...props} />;
                        })}
                     </div>
                     <div className="btn-group" style={{ width: "100%" }}>
                        <button
                           type="button"
                           className="btn"
                           disabled={!this.state.deletions.length}
                           onClick={this.saveChanges.bind(this)}
                        >
                           Save Changes
                        </button>
                        <button
                           type="button"
                           className="btn"
                           onClick={this.cancel.bind(this)}
                        >
                           Cancel
                        </button>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="jumbotron-content">
                  <h2>Data Sets</h2>
                  <hr className="reg-spacer" />
                  <p>Manage all currently available user-uploaded datasets.</p>
                  {this.state.loading && <div className="loader loader-xl" />}
                  {!this.state.loading &&
                     !this.state.hasData && (
                        <div className="block-error">
                           No data sets have been uploaded yet.&nbsp;
                           <Link to="/data-upload">upload one</Link>
                        </div>
                     )}
               </div>
            )}
         </div>
      );
   }
}

export default DataSets;
