// external modules
import React from "react";
import { Link } from "react-router";

const Pivot = props => (
   <div className="jumbotron text-center">
      <div className="jumbotron-content">
         <h2>Welcome to Crossroads Data.</h2>
         <hr className="reg-spacer" />
         <div className="btn-group" style={{ width: "100%" }}>
            <Link className="btn no-underline" to="/map/trips">
               Trip Map
            </Link>
            <a
               className="btn no-underline"
               href="/public/pdfs/crossroads-user-guide.pdf"
               target="_blank"
               rel="nofollow"
            >
               User Guide
            </a>
         </div>
         <div className="btn-group" style={{ width: "100%" }}>
            <Link className="btn no-underline" to="/data-upload/file-selection">
               Data Upload
            </Link>
            <Link
               className="btn no-underline no-margin-right"
               to="/data-sets/dashboard"
            >
               Data Sets
            </Link>
         </div>
      </div>
   </div>
);

export default Pivot;
