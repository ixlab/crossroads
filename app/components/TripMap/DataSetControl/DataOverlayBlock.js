// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import PinIcon from "react-icons/lib/fa/thumb-tack";

// custom modules
import { accentColor } from "!!sass-variable-loader!scss-variables";

export default class DataOverlayBlock extends Component {
   static propTypes = {
      color: PropTypes.string,
      className: PropTypes.string,
      header: PropTypes.string.isRequired
   };

   static defaulProps = {
      color: accentColor
   };

   constructor(props) {
      super(props);

      this.state = {
         active: true
      };
   }

   toggleBlock() {
      this.setState({ active: !this.state.active });
   }

   render() {
      const props = { className: "OverlayBlock" };

      if (!this.state.active) {
         props.onClick = this.toggleBlock.bind(this);
         props.className += "--compressed";
         props.style = { backgroundColor: this.props.color };
      }
      if (this.props.className) {
         props.className += ` ${this.props.className}`;
      }

      return (
         <div {...props}>
            {this.state.active && (
               <span>
                  <div className="OverlayBlock__Pin">
                     <PinIcon
                        size={18}
                        className="dark-icon"
                        onClick={this.toggleBlock.bind(this)}
                     />
                  </div>
                  <div className="OverlayBlock__Header">
                     <p className="OverlayBlock__Header__Title bold">
                        {this.props.header}
                     </p>
                  </div>
                  <div className="OverlayBlock__Body">
                     {this.props.children}
                  </div>
               </span>
            )}
            {!this.state.active && (
               <span>
                  <div className="OverlayBlock__IconBlock bold">
                     {this.props.header[0].toUpperCase()}
                  </div>
               </span>
            )}
         </div>
      );
   }
}
