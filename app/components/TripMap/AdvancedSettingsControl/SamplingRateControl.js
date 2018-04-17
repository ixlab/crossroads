// external modules
import React, { Component, PropTypes } from "react";
import Slider from "rc-slider";
import InfoIcon from "react-icons/lib/fa/info-circle";
import { connect } from "react-redux";

// custom modules
import Control from "components/Control";
import { advancedSettingsActions } from "actions";

class SamplingRateControl extends Component {
   getInfo() {
      const { samplingRate } = this.props;

      if (samplingRate < 5) {
         return (
            <div className="block-error margin-bottom--md">
               This is a very low sample, and will likely not provide accurate
               results.
            </div>
         );
      } else if (samplingRate < 15) {
         return (
            <div className="block-warn margin-bottom--md">
               This is a relatively low sample, and should only be used to
               quickly get a general overview of the dataset.
            </div>
         );
      } else if (samplingRate >= 15 && samplingRate <= 50) {
         return (
            <div className="block-info margin-bottom--md">
               This is a good compromise between speed and accuracy, and will
               provide servicable results.
            </div>
         );
      } else if (samplingRate > 75) {
         return (
            <div className="block-error margin-bottom--md">
               This is an excessively large sample, and should only be used once
               a desired query has been found and the highest accurary possible
               is desired. Performance will suffer severely.
            </div>
         );
      } else if (samplingRate > 50) {
         return (
            <div className="block-warn margin-bottom--md">
               This is a relatively large sample, and while it will provide
               great accuracy, speed will suffer.
            </div>
         );
      }
   }

   onChange(sliderVal) {
      this.props.softUpdateSamplingRate(sliderVal);
   }

   onAfterChange(sliderVal) {
      this.props.hardUpdateSamplingRate(sliderVal);
   }

   render() {
      return (
         <Control.Sub
            className="SamplingRateControl"
            title="Sampling Rate"
            icon={<InfoIcon />}
            helpText="What percentage of the database to sample when performing queries. A higher value will be more accurate, but much slower."
            collapsed
         >
            {this.getInfo()}
            <Slider
               className="ReactSlider"
               max={100}
               value={this.props.samplingRate}
               onChange={this.onChange.bind(this)}
               onAfterChange={this.onAfterChange.bind(this)}
            />
            <p className="bold text-center">{this.props.samplingRate}%</p>
         </Control.Sub>
      );
   }
}

export default connect(
   ({ constraints: { advancedSettings: { samplingRate } } }) => ({
      samplingRate
   }),
   {
      softUpdateSamplingRate: advancedSettingsActions.samplingRate.update.soft,
      hardUpdateSamplingRate: advancedSettingsActions.samplingRate.update.hard
   }
)(SamplingRateControl);
