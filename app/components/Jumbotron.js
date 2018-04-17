import React, { Component } from "react";
import PropTypes from "prop-types";

class Jumbotron extends Component {
   static propTypes = {
      width: PropTypes.number,
      header: PropTypes.string,
      subheader: PropTypes.string
   };

   constructor(props) {
      super(props);
   }

   getHeader() {
      return (
         <div className="jumbotron-header">
            {this.props.header && <h2>{this.props.header}</h2>}
            {this.props.header && <hr className="reg-spacer" />}
            {this.props.subheader && <p>{this.props.subheader}</p>}
         </div>
      );
   }

   // abstract method
   _render() {
      return <noscript />;
   }

   render() {
      return <div className="jumbotron">{this._render()}</div>;
   }
}

class BasicJumbotron extends Jumbotron {
   _render() {
      const style = {};
      if (this.props.width) style.maxWidth = `${this.props.width}px`;

      return (
         <div className="jumbotron-content" style={style}>
            {super.getHeader()}
            {this.props.children}
         </div>
      );
   }
}

class ScrollableJumbotron extends Jumbotron {
   _render() {
      const style = {};
      if (this.props.width) style.maxWidth = `${this.props.width}px`;

      return (
         <div className="jumbotron-scrollable">
            <div className="jumbotron-content" style={style}>
               {super.getHeader()}
               {this.props.children}
            </div>
         </div>
      );
   }
}

module.exports = {
   Basic: BasicJumbotron,
   Scrollable: ScrollableJumbotron
};
