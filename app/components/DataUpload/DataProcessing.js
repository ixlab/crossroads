// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

// custom modules
import { dataUploadActions } from "actions";
import { sqlUtils, toUnix } from "utils";
import { PROCESSING_MSG as MSG } from "utils/constants";

class DataProcessing extends Component {
   static contextTypes = { router: PropTypes.object };

   componentDidMount() {
      // give the component time to render
      setTimeout(() => {
         this.processData()
            .then(res => {
               this.setState({ message: MSG.UPLOADING });

               // give the component time to render
               setTimeout(() => {
                  this.uploadData()
                     .then(res => {
                        this.context.router.push("/data-upload/complete");
                     })
                     .catch(err => {
                        console.error(err);
                        this.setState({ failed: true });
                     });
               }, 500);
            })
            .catch(err => {
               console.error(err);
               this.setState({ failed: true });
            });
      }, 500);
   }

   uploadData() {
      const promise = new Promise((resolve, reject) => {
         axios
            .post("/api/data-upload/upload-sqlite", {
               // TODO: update this based on the user
               filename: "sql.db",
               data: window.db.export()
            })
            .then(res => {
               this.props.clearDataUpload();
               this.props.clearIgnoredColumns();
               this.props.clearTableConfig();
               resolve({ success: true });
            })
            .catch(err => {
               console.error(err);
               reject({ success: false });
            });
      });

      return promise;
   }

   processData() {
      const promise = new Promise((resolve, reject) => {
         const { tableConfig, data, ignored } = this.props.dataUpload;
         const cols = Object.keys(data[0]).filter(
            col => ignored.indexOf(col) === -1
         );
         const values = [];

         data.forEach(datum => {
            // row is malformed if there are less columns in the datum
            // then there are columns after filtering out the ignored
            // columns
            if (Object.keys(datum).length < cols.length) return;
            else
               // create the values to add
               values.push(
                  `(${cols.map(col => {
                     if (col === tableConfig.timeColumn)
                        return toUnix(datum[col], tableConfig.timeUnits);
                     else return sqlUtils.guessDataType(datum[col]);
                  })})`
               );
         });

         const insertQuery = (offset, num) => `
				INSERT INTO ${tableConfig.tableName} (${cols.join(",")})
					VALUES ${values.slice(offset, offset + num).join(",")};
			`;
         const createQuery = `
				CREATE TABLE ${tableConfig.tableName} (${cols.join(",")});
			`;

         window.db.run(createQuery);

         /**
				NOTE: insert 1000 rows at a time; seems to be issues when
				inserting too many at once; sql.js throws the following
				sqlite error on the next operation:

				"Library Routine Called Out Of Sequence"

				Could be due to the size of the string being used. Should
				probably template this out using sql.js syntax ((?, ?), etc.)
				instead of using a template string.
			*/
         const NUM = 1000;
         for (let i = 0; i < values.length; i += NUM) {
            const q = insertQuery(i, NUM);
            window.db.run(q);
         }

         sqlUtils.tableInfo.insert(tableConfig, cols);

         resolve({ success: true });
      });

      return promise;
   }

   constructor(props) {
      super(props);

      this.state = {
         failed: false,
         message: MSG.PROCESSING
      };
   }

   goHome() {
      this.context.router.push("/");
   }

   uploadAnother() {
      this.context.router.push("/data-upload");
   }

   render() {
      return (
         <div className="jumbotron">
            <div className="jumbotron-content">
               <h2>DataProcessing</h2>
               <hr className="reg-spacer" />
               {this.state.failed ? (
                  <span style={{ width: "100%" }}>
                     <div className="block-error">
                        An error occurred and the data upload could not be
                        completed. Please try again later.
                     </div>
                     <div className="btn-group" style={{ width: "100%" }}>
                        <button
                           type="button"
                           className="btn"
                           style={{ width: "50%" }}
                           onClick={this.goHome.bind(this)}
                        >
                           Home
                        </button>
                        <button
                           type="button"
                           className="btn"
                           style={{ width: "50%" }}
                           onClick={this.uploadAnother.bind(this)}
                        >
                           Upload Another
                        </button>
                     </div>
                  </span>
               ) : (
                  <span>
                     <p>{this.state.message}</p>
                     <div className="loader loader-xl" />
                  </span>
               )}
            </div>
         </div>
      );
   }
}

export default connect(({ dataUpload }) => ({ dataUpload }), {
   clearDataUpload: dataUploadActions.data.clear,
   clearIgnoredColumns: dataUploadActions.ignored.clear,
   clearTableConfig: dataUploadActions.tableConfig.clear
})(DataProcessing);
