// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";

// custom modules
import Modal from "components/Modal";

export default class DownloadingModal extends Component {
   static propTypes = {
      text: PropTypes.string.isRequired,
      fill: PropTypes.number.isRequired
   };

   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Modal.Component modalId="NotificationModal" dismissable={false}>
            <div className="Notification">
               <div className="Notification__Content">
                  <div className="Notification__Content__Text">
                     <h2>Download in Progress</h2>
                     <hr
                        className="reg-spacer"
                        style={{ display: "inline-block" }}
                     />
                     <h4>{this.props.text}</h4>
                  </div>
                  <div className="Notification__Content__Loader">
                     <div style={{ width: `${this.props.fill}%` }} />
                  </div>
               </div>
            </div>
         </Modal.Component>
      );
   }
}
