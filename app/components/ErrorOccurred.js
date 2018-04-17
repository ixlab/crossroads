// external modules
import React, { Component } from "react";
import { Link } from "react-router";

class ErrorOccurred extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div className="jumbotron">
            <div className="jumbotron-content">
               <h2>An Error Occurred</h2>
               <hr className="reg-spacer" />
               <div className="block-error">
                  An error occurred. Please try again later.
               </div>
               <div className="btn-group" style={{ width: "100%" }}>
                  <Link to="/" className="btn no-underline no-margin-right">
                     Home
                  </Link>
               </div>
            </div>
         </div>
      );
   }
}

export default ErrorOccurred;
