// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UploadIcon from "react-icons/lib/fa/upload";
import FileIcon from "react-icons/lib/fa/file";
import Papa from "papaparse";

// custom modules
import { dataUploadActions } from "actions";
import { ACCEPTED_TYPES } from "utils/constants";

class DataUpload extends Component {
   static contextTypes = { router: PropTypes.object };

   constructor(props) {
      super(props);

      this.state = {
         draggingOver: false,
         file: null,
         failureMessage: "",
         processing: false,
         data: []
      };
   }

   clickInput() {
      this.fileInput.click();
   }

   checkFile(file = {}) {
      const fail = msg => {
         this.setState({ failureMessage: msg });
         this.fileInput.value = "";
         this.setState({ file: null });
      };

      const pass = data => {
         this.setState({ failureMessage: "", file: file, ...data });
      };

      switch (file.type) {
         case ACCEPTED_TYPES.CSV:
         case ACCEPTED_TYPES.TSV:
         case ACCEPTED_TYPES.MS_CSV:
            pass();
            break;
         case ACCEPTED_TYPES.JSON:
            const reader = new FileReader();
            reader.onloadend = ({ srcElement: { result } }) => {
               const json = JSON.parse(result);
               if (Array.isArray(json)) {
                  pass({ data: json });
               } else fail("JSON was not an array");
            };
            reader.readAsText(file);
            break;
         default:
            fail(
               "File type was invlaid. Please make sure it is one of the above formats."
            );
            break;
      }
   }

   onFileChange() {
      const [file] = this.fileInput.files;
      this.checkFile(file);
   }

   onDragEnter(e) {
      this.setState({ draggingOver: true });
      e.stopPropagation();
      e.preventDefault();
      return false;
   }

   onDragLeave(e) {
      this.setState({ draggingOver: false });
      e.stopPropagation();
      e.preventDefault();
      return false;
   }

   onDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
   }

   onDrop(e) {
      e.preventDefault();
      const { dataTransfer: { files: [file] = [] } = {} } = e;
      this.checkFile(file);
      return false;
   }

   submitFile() {
      const { file } = this.state;
      const complete = data => {
         this.setState({ processing: false });
         this.props.updateDataUpload(file, data);
         this.props.updateTableConfig({
            tableName: file.name.split(".").shift()
         });
         this.context.router.push("/data-upload/column-selection");
      };

      if (this.state.data.length) {
         complete(this.state.data);
      } else {
         this.setState({ processing: true });
         Papa.parse(file, {
            header: true,
            complete: ({ data, errors = [] }) => {
               let failures = errors.filter(
                  ({ code }) => code != "TooFewFields"
               );
               if (failures.length) {
                  this.setState({
                     failureMessage:
                        "The file could not be parsed. Please check the encoding; the file should be a raw CSV not a Microsoft Excel file."
                  });
                  this.fileInput.value = "";
                  this.setState({ file: null, processing: false });
               } else {
                  complete(data);
               }
            }
         });
      }
   }

   render() {
      const fileDropClassNames = ["file-drop"];
      if (this.state.draggingOver) {
         fileDropClassNames.push("dragging-over");
      }

      return (
         <div className="jumbotron">
            <div className="jumbotron-content">
               <h2>Data Upload</h2>
               <hr className="reg-spacer" />
               <p>
                  Please select a file to upload. Acceptable formats include:
               </p>
               <ul className="file-type-list">
                  <li>CSV</li>
                  <li>TSV</li>
                  <li>JSON array</li>
               </ul>
               {this.state.file && (
                  <div className="block-success">
                     File received:&nbsp;
                     <span className="bold" style={{ color: "inherit" }}>
                        {this.state.file.name}
                     </span>
                  </div>
               )}
               {this.state.failureMessage && (
                  <div className="block-error">
                     Upload failed:&nbsp;
                     <span className="bold" style={{ color: "inherit" }}>
                        {this.state.failureMessage}
                     </span>
                  </div>
               )}
               <div className="file-upload-wrapper">
                  <input
                     className="file-select"
                     type="file"
                     style={{ display: "none" }}
                     ref={fileInput => {
                        this.fileInput = fileInput;
                     }}
                     onChange={this.onFileChange.bind(this)}
                  />
                  {!this.state.processing && (
                     <div
                        className={fileDropClassNames.join(" ")}
                        onClick={this.clickInput.bind(this)}
                        onDragEnter={this.onDragEnter.bind(this)}
                        onDragLeave={this.onDragLeave.bind(this)}
                        onDragOver={this.onDragOver.bind(this)}
                        onDrop={this.onDrop.bind(this)}
                     >
                        <div style={{ pointerEvents: "none" }}>
                           <FileIcon
                              className="dark-icon"
                              size={18}
                              style={{ marginRight: "15px" }}
                           />
                           Drop files here.
                        </div>
                     </div>
                  )}
               </div>
               {!this.state.processing && (
                  <div className="btn-group" style={{ width: "100%" }}>
                     <button
                        className="btn"
                        style={{ width: "50%" }}
                        type="button"
                        onClick={this.clickInput.bind(this)}
                     >
                        <UploadIcon
                           className="dark-icon"
                           size={18}
                           style={{ marginRight: "15px" }}
                        />
                        Select File
                     </button>
                     <button
                        className="btn no-margin-right"
                        style={{ width: "50%" }}
                        type="button"
                        disabled={!this.state.file}
                        onClick={this.submitFile.bind(this)}
                     >
                        Submit
                     </button>
                  </div>
               )}
               {this.state.processing && (
                  <div
                     className="loader loader-xl"
                     style={{ marginTop: "25px" }}
                  />
               )}
            </div>
         </div>
      );
   }
}

export default connect(null, {
   updateDataUpload: dataUploadActions.data.update,
   updateTableConfig: dataUploadActions.tableConfig.update
})(DataUpload);
