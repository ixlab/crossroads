// external modules
import React, { Component } from "react";
import { Link } from "react-router";

class NotFound extends Component {
   render() {
      return (
         <div className="jumbotron">
            <div className="jumbotron-content">
               <h1 className="text-center">404</h1>
               <hr className="reg-spacer" />
               <h4 className="text-center">Nothing Here.</h4>
               <Link
                  className="btn no-underline"
                  to="/"
                  style={{
                     width: "100%",
                     textAlign: "center",
                     marginRight: 0,
                     marginTop: "20px"
                  }}
               >
                  Home
               </Link>
            </div>
         </div>
      );
   }
}

export default NotFound;
