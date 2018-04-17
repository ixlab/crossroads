// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { SliderPicker } from "react-color";
import ColorIcon from "react-icons/lib/fa/paint-brush";
import CloseIcon from "react-icons/lib/fa/close";

// custom modules
import { randomColor } from "utils";

export default class ColorPicker extends Component {
   static propTypes = {
      initialColor: PropTypes.string,
      colorChanged: PropTypes.func
   };

   constructor(props) {
      super(props);

      this.state = {
         color: this.props.initialColor || randomColor(),
         updatingColor: false
      };
   }

   toggleColorPicker() {
      this.setState({ updatingColor: !this.state.updatingColor });
   }

   handleColorChange({ hex: color }) {
      this.setState({ color });
      this.props.colorChanged && this.props.colorChanged(color);
   }

   render() {
      return (
         <div className="ColorPicker">
            <button
               type="button"
               className="ColorPicker__Button btn no-margin"
               onClick={this.toggleColorPicker.bind(this)}
               style={{ backgroundColor: this.state.color }}
            >
               <ColorIcon size={18} className="ColorPicker__Icon dark-icon" />&nbsp;
               {this.state.color}
            </button>
            {this.state.updatingColor && (
               <div className="ColorPicker__Picker">
                  <CloseIcon
                     size={18}
                     className="dark-icon ColorPicker__ClosePicker"
                     onClick={this.toggleColorPicker.bind(this)}
                  />
                  <SliderPicker
                     color={this.state.color}
                     style={{ width: "100%" }}
                     onChangeComplete={this.handleColorChange.bind(this)}
                  />
               </div>
            )}
         </div>
      );
   }
}
