// external modules
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

// custom modules
import Control from "components/Control";
import LatencyControl from "./LatencyControl";
import SamplingRateControl from "./SamplingRateControl";

export default class AdvancedSettingsControl extends Component {
   render() {
      return (
         <Control.Main
            className="AdvancedSettingsControl"
            title="Advanced Settings"
            collapsed
         >
            <LatencyControl speculationActive={false} />
            <SamplingRateControl />
         </Control.Main>
      );
   }
}
