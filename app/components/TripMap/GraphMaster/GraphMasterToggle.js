// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import GraphIcon from "react-icons/lib/fa/bar-chart";
import CloseIcon from "react-icons/lib/fa/close";

export default class GraphMasterToggle extends Component {
   static propTypes = {
      toggle: PropTypes.func,
      active: PropTypes.bool
   };

   static defaultProps = {
      active: true
   };

   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div className="GraphMaster__Toggle" onClick={this.props.toggle}>
            {this.props.active ? (
               <CloseIcon size={21} className="dark-icon" />
            ) : (
               <GraphIcon size={21} className="dark-icon" />
            )}
         </div>
      );
   }
}
