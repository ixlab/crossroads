// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import CloseIcon from "react-icons/lib/fa/close";
import InfoIcon from "react-icons/lib/fa/info-circle";
import SuccessIcon from "react-icons/lib/fa/check-circle";
import WarningIcon from "react-icons/lib/fa/exclamation-triangle";
import ErrorIcon from "react-icons/lib/fa/exclamation-circle";

class Notification extends Component {
   static propTypes = {
      className: PropTypes.string
   };

   constructor(props) {
      super(props);

      this.state = { visible: true };
   }

   // hide the notification
   hide() {
      this.setState({ visible: false });
   }

   /**
    * Get the icon for the notification.
    * @returns the JSX icon element
    */
   getIcon() {
      if (this.props.type === "success")
         return <SuccessIcon className="success-icon" size={21} />;
      else if (this.props.type === "warning")
         return <WarningIcon className="warning-icon" size={21} />;
      else if (this.props.type === "error")
         return <ErrorIcon className="error-icon" size={21} />;
      else return <InfoIcon className="info-icon" size={21} />;
   }

   render() {
      const classNames = ["notification-wrapper"];
      this.props.className && classNames.push(this.props.className);

      return this.state.visible ? (
         <div className={classNames.join(" ")}>
            {this.getIcon()}
            <p>{this.props.text}</p>
            <CloseIcon
               className="dark-icon"
               size={15}
               onClick={this.hide.bind(this)}
            />
         </div>
      ) : (
         <noscript />
      );
   }
}

Notification.propTypes = {
   type: PropTypes.string,
   text: PropTypes.string
};

export default Notification;
