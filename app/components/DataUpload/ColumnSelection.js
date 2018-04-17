// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// custom modules
import { dataUploadActions } from "actions";

class ColumnSelection extends Component {
   static contextTypes = { router: PropTypes.object };

   constructor(props) {
      super(props);
   }

   goBack() {
      this.props.clearDataUpload();
      this.context.router.push("/data-upload");
   }

   goNext() {
      this.context.router.push("/data-upload/table-configuration");
   }

   toggleColumn(i, j) {
      const col = this.processColumns()[i][j];
      this.props.toggleIgnoredColumn(col);
   }

   processColumns() {
      let arr = Object.keys(this.props.dataUpload.data[0]);
      let final = [];

      for (let i = 0; i < arr.length; i += 3) {
         const tmp = [];
         if (arr[i]) tmp.push(arr[i]);
         if (arr[i + 1]) tmp.push(arr[i + 1]);
         if (arr[i + 2]) tmp.push(arr[i + 2]);
         final.push(tmp);
      }

      return final;
   }

   render() {
      return (
         <div className="jumbotron">
            <div className="jumbotron-content" style={{ maxWidth: "700px" }}>
               <h2>Column Selection</h2>
               <hr className="reg-spacer" />
               <p>
                  Please exclude the columns you would like to ignore (if any)
               </p>
               <div className="column-wrapper" style={{ width: "100%" }}>
                  {this.processColumns().map((group, i) => (
                     <div
                        key={i}
                        className="btn-group"
                        style={{ width: "100%" }}
                     >
                        {group.map((col, j) => {
                           const classNames = ["btn"];
                           if (
                              this.props.dataUpload.ignored.indexOf(col) === -1
                           )
                              classNames.push("active");
                           return (
                              <button
                                 key={j}
                                 className={classNames.join(" ")}
                                 type="button"
                                 style={{ width: "33%" }}
                                 onClick={() => this.toggleColumn(i, j)}
                              >
                                 {col}
                              </button>
                           );
                        })}
                     </div>
                  ))}
               </div>
               <hr className="reg-spacer" />
               <div className="btn-group" style={{ width: "100%" }}>
                  <button
                     type="button"
                     className="btn"
                     onClick={this.goBack.bind(this)}
                  >
                     Back
                  </button>
                  <button
                     type="button"
                     className="btn"
                     onClick={this.props.clearIgnoredColumns.bind(this)}
                  >
                     Clear
                  </button>
                  <button
                     type="button"
                     className="btn no-margin-right"
                     disabled={
                        Object.keys(this.props.dataUpload.data[0]).length -
                           this.props.dataUpload.ignored.length ===
                        0
                     }
                     onClick={this.goNext.bind(this)}
                  >
                     Next
                  </button>
               </div>
            </div>
         </div>
      );
   }
}

export default connect(({ dataUpload }) => ({ dataUpload }), {
   clearDataUpload: dataUploadActions.data.clear,
   toggleIgnoredColumn: dataUploadActions.ignored.toggle,
   clearIgnoredColumns: dataUploadActions.ignored.clear
})(ColumnSelection);
