import React, { Component } from "react";
import PropTypes from "prop-types";

class UploadComplete extends Component {
   static contextTypes = { router: PropTypes.object };

   constructor(props) {
      super(props);
   }

   goHome() {
      this.context.router.push("/");
   }

   uploadAnother() {
      this.context.router.push("/data-upload");
   }

   viewDataSets() {
      this.context.router.push("/data-sets");
   }

   render() {
      return (
         <div className="jumbotron">
            <div className="jumbotron-content" style={{ maxWidth: "550px" }}>
               <h2>Data Upload Complete</h2>
               <hr className="reg-spacer" />
               <p>Data upload was successful.</p>
               <div className="btn-group" style={{ width: "100%" }}>
                  <button
                     type="button"
                     className="btn"
                     style={{ width: "33%" }}
                     onClick={this.goHome.bind(this)}
                  >
                     Home
                  </button>
                  <button
                     type="button"
                     className="btn"
                     style={{ width: "33%" }}
                     onClick={this.uploadAnother.bind(this)}
                  >
                     Upload Another
                  </button>
                  <button
                     type="button"
                     className="btn"
                     style={{ width: "33%" }}
                     onClick={this.viewDataSets.bind(this)}
                  >
                     View Data Sets
                  </button>
               </div>
            </div>
         </div>
      );
   }
}

export default UploadComplete;
