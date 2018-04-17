// external modules
import React, { Component, PropTypes } from "react";

export default class IconPopover extends Component {
   static propTypes = {
      className: PropTypes.string,
      text: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      popoverText: PropTypes.string.isRequired
   };

   render() {
      const classNames = ["IconPopover"];
      if (this.props.className) classNames.push(this.props.className);

      return (
         <span className={classNames.join(" ")}>
            {this.props.text}
            {React.cloneElement(this.props.icon, {
               size: 18,
               className: "Icon--interactive IconPopover__Icon"
            })}
            <p className="IconPopover__Popover">{this.props.popoverText}</p>
         </span>
      );
   }
}
