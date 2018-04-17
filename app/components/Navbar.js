// external modules
import React, { Component } from "react";
import { Link } from "react-router";
import HomeIcon from "react-icons/lib/fa/home";
import MapIcon from "react-icons/lib/fa/map";
import UploadIcon from "react-icons/lib/fa/upload";
import DataIcon from "react-icons/lib/fa/database";

class Navbar extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div className="nav-content">
            <div className="nav">
               <div className="nav-logo-wrapper" />
               <div className="nav-link-wrapper">
                  <Link to="/" className="nav-link">
                     <HomeIcon
                        size={18}
                        className="dark-icon"
                        style={{ marginRight: "15px" }}
                     />
                     Home
                  </Link>
                  <Link to="/map" className="nav-link">
                     <MapIcon
                        size={18}
                        className="dark-icon"
                        style={{ marginRight: "15px" }}
                     />
                     Map
                  </Link>
                  <Link to="/data-upload" className="nav-link">
                     <UploadIcon
                        size={18}
                        className="dark-icon"
                        style={{ marginRight: "15px" }}
                     />
                     Data Upload
                  </Link>
                  <Link to="/data-sets" className="nav-link">
                     <DataIcon
                        size={18}
                        className="dark-icon"
                        style={{ marginRight: "15px" }}
                     />
                     Data Sets
                  </Link>
               </div>
            </div>
            {this.props.children}
         </div>
      );
   }
}

export default Navbar;
