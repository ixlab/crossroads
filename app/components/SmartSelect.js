import React, { Component, PropTypes } from "react";
import CloseIcon from "react-icons/lib/fa/close";
import CheckIcon from "react-icons/lib/fa/check";

// NOTE: this assumes all options given are unique

class SmartSelect extends Component {
   componentDidUpdate(prevProps, prevState) {
      if (this.state.selections.length > prevState.selections.length)
         this.selectionWrapper.scrollTop = this.selectionWrapper.scrollHeight;
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.selections !== this.state.selections)
         this.setState({ selections: nextProps.selections });
   }

   constructor(props) {
      super(props);

      this.state = {
         selections: this.props.selections || []
      };
   }

   optionClicked({ target: { textContent: option } }) {
      if (this.state.selections.indexOf(option) === -1) {
         const selections = [...this.state.selections, option];
         this.setState({ selections });
         this.props.onChange && this.props.onChange(selections);
      }
   }

   removeSelection(value) {
      const selections = this.state.selections.filter(
         selection => selection !== value
      );
      this.setState({ selections });
      this.props.onChange && this.props.onChange(selections);
   }

   render() {
      return (
         <div className="smart-select">
            <div
               className="selection-wrapper"
               ref={selectionWrapper => {
                  this.selectionWrapper = selectionWrapper;
               }}
            >
               {!!this.state.selections.length &&
                  this.state.selections.map(selection => (
                     <div key={selection} className="selection">
                        {selection}
                        <CloseIcon
                           className="close-icon"
                           onClick={() => this.removeSelection(selection)}
                        />
                     </div>
                  ))}
               {!this.state.selections.length && (
                  <div className="no-selection">
                     {this.props.placeholder || "No Selection"}
                  </div>
               )}
            </div>
            <div className="options-wrapper">
               {this.props.options.map(option => (
                  <div
                     key={option}
                     className="option"
                     onClick={this.optionClicked.bind(this)}
                  >
                     {option}
                     {this.state.selections.indexOf(option) !== -1 && (
                        <CheckIcon />
                     )}
                  </div>
               ))}
            </div>
         </div>
      );
   }
}

SmartSelect.propTypes = {
   onChange: PropTypes.func,
   placeholder: PropTypes.string,
   options: PropTypes.array,
   selections: PropTypes.array
};

export default SmartSelect;
