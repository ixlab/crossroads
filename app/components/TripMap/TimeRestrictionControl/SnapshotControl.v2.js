// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import InfoIcon from "react-icons/lib/fa/info-circle";
import Slider from "rc-slider";
import Toggle from "react-toggle";
import moment from "moment";
import throttle from "lodash.throttle";
import DownCaret from "react-icons/lib/md/arrow-drop-down";
import L from "leaflet";

// custom modules
import Control from "components/Control";
import { downloadUtils, svgToCanvas } from "utils";
import {
   RESOLUTION,
   DOWNLOAD_STAGE,
   THROTTLE_THRES,
   PLAY_ANIM
} from "utils/constants";
import { constraintActions } from "actions";
import DownloadingModal from "components/TripMap/DownloadingModal";
import fireEvent from "utils/fire-event";
import { CompanionButton } from "components/Buttons";

class SnapshotControl extends Component {
   static propTypes = {
      snapshot: PropTypes.shape({
         active: PropTypes.bool.isRequired,
         slider: PropTypes.number.isRequired,
         resolution: PropTypes.string.isRequired
      }).isRequired,
      map: PropTypes.object.isRequired,
      toggle: PropTypes.func.isRequired,
      updateSlider: PropTypes.func.isRequired,
      updateResolution: PropTypes.func.isRequired
   };

   goToNextFrame() {
      const max = this.getMaxValue();
      const now = moment();
      const prev = this.prev || now;
      const diff = now.diff(prev);
      const { minWait } = this.state;

      setTimeout(() => {
         if (this.props.snapshot.slider < max) {
            this.props.updateSlider(this.props.snapshot.slider + 1);
         } else {
            fireEvent.removeCallback("map-updated", this.goToNextFrame);
            this.setState({ isPlaying: false });
         }
         this.prev = moment();
      }, minWait - diff);
   }

   constructor(props) {
      super(props);

      this.state = {
         isPlaying: false,
         isDownloading: false,
         downloadStage: null,
         downloadProgress: null,
         minWait: PLAY_ANIM.MIN_WAIT
      };

      this.goToNextFrame = this.goToNextFrame.bind(this);
      this.throttledUpdateSlider = throttle(
         this.props.updateSlider,
         THROTTLE_THRES
      );
   }

   getClassNames() {
      const classNames = {
         [RESOLUTION.DAY]: "btn no-margin-top",
         [RESOLUTION.WEEK]: "btn no-margin-top",
         [RESOLUTION.MONTH]: "btn no-margin-top"
      };
      classNames[this.props.snapshot.resolution] += " active";
      return classNames;
   }

   getMaxValue() {
      if (!this.props.dateRange.start || !this.props.dateRange.end) return 0;

      const duration = moment.duration(
         this.props.dateRange.end.diff(this.props.dateRange.start)
      );
      switch (this.props.snapshot.resolution) {
         case RESOLUTION.DAY:
            return Math.floor(duration.asDays());
         case RESOLUTION.WEEK:
            return Math.floor(duration.asWeeks()) - 1;
         case RESOLUTION.MONTH:
            return Math.floor(duration.asMonths()) - 1;
      }
   }

   getSliderText() {
      if (!this.props.dateRange.start || !this.props.dateRange.end) return "";

      switch (this.props.snapshot.resolution) {
         case RESOLUTION.DAY:
            return moment(this.props.dateRange.start)
               .add(this.props.snapshot.slider, "days")
               .format("MM/DD/YYYY");
         case RESOLUTION.WEEK:
            return (
               moment(this.props.dateRange.start)
                  .add(this.props.snapshot.slider, "weeks")
                  .format("MM/DD/YYYY") +
               " - " +
               moment(this.props.dateRange.start)
                  .add(this.props.snapshot.slider + 1, "weeks")
                  .format("MM/DD/YYYY")
            );
         case RESOLUTION.MONTH:
            return moment(this.props.dateRange.start)
               .add(this.props.snapshot.slider, "months")
               .format("MM/YYYY");
      }
   }

   handlePlayClick() {
      if (this.state.isPlaying) {
         fireEvent.removeCallback("map-updated", this.goToNextFrame);
      } else {
         fireEvent.registerCallback("map-updated", this.goToNextFrame);
         this.goToNextFrame();
      }

      this.setState({ isPlaying: !this.state.isPlaying });
   }

   downloadHeatmap() {
      this.setState({
         isDownloading: true,
         downloadStage: DOWNLOAD_STAGE.GENERATING_FRAMES.TEXT,
         downloadProgress: DOWNLOAD_STAGE.GENERATING_FRAMES.VALUE
      });

      const dimensions = this.props.map.getSize();
      const max = this.getMaxValue();
      const frames = [];

      const buildGif = () => {
         this.setState({
            downloadStage: DOWNLOAD_STAGE.GENERATING_BLOBS.TEXT,
            downloadProgress: DOWNLOAD_STAGE.GENERATING_BLOBS.VALUE
         });

         new Promise((resolve, reject) => {
            const urls = [];

            frames.forEach(frame => {
               frame.toBlob(blob => {
                  const url = URL.createObjectURL(blob);
                  urls.push(url);
                  if (urls.length === frames.length) resolve(urls);
               });
            });
         }).then(frameUrls => {
            this.setState({
               downloadStage: DOWNLOAD_STAGE.GENERATING_GIF.TEXT,
               downloadProgress: DOWNLOAD_STAGE.GENERATING_GIF.VALUE
            });

            downloadUtils
               .makeGIF(frameUrls, dimensions.x, dimensions.y)
               .then(gif => {
                  fetch(gif)
                     .then(res => res.blob())
                     .then(blob => {
                        this.setState({
                           downloadStage: DOWNLOAD_STAGE.DOWNLOADING_FILE.TEXT,
                           downloadProgress:
                              DOWNLOAD_STAGE.DOWNLOADING_FILE.VALUE
                        });

                        downloadUtils
                           .downloadFromBlob(blob, "heatmap", "gif")
                           .then(success => {
                              setTimeout(() => {
                                 this.setState({
                                    isDownloading: false,
                                    downloadStage: null,
                                    downloadProgress: null
                                 });
                              }, 3000);
                           });
                     });
               })
               .catch(error => {
                  console.error(error);
               })
               .then(() => {
                  frameUrls.forEach(url => URL.revokeObjectURL(url));
               });
         });
      };

      const processFrame = () => {
         // get heatmap canvases
         const canvases = document.querySelectorAll(
            ".leaflet-overlay-pane canvas"
         );
         const svgs = document.querySelectorAll(".leaflet-overlay-pane svg");

         downloadUtils
            .getCurrentMap(this.props.map, canvases, svgs)
            .then(frame => {
               const frameCtx = frame.getContext("2d");

               // draw bar
               const bar = downloadUtils.barCanvas(
                  dimensions.x,
                  dimensions.y,
                  this.props.snapshot.slider,
                  max
               );
               frameCtx.drawImage(bar, 0, 0);

               // draw watermark
               const waterMark = downloadUtils.generateWatermark(
                  this.getSliderText(),
                  dimensions.x,
                  dimensions.y
               );
               frameCtx.drawImage(waterMark, 0, 0);

               // add the frame to the list and move on to the next snapshot
               frames.push(frame);

               if (this.props.snapshot.slider < max) {
                  this.props.updateSlider(this.props.snapshot.slider + 1);
               } else {
                  fireEvent.removeCallback("map-updated", processFrame);
                  buildGif();
               }
            });
      };

      fireEvent.registerCallback("map-updated", processFrame);

      if (this.props.snapshot.slider != 0) {
         this.props.updateSlider(0);
      } else {
         processFrame();
      }
   }

   onCompanionSelect(selection) {
      this.setState({ minWait: selection.value });
   }

   render() {
      const {
         [RESOLUTION.DAY]: dayClassNames,
         [RESOLUTION.WEEK]: weekClassNames,
         [RESOLUTION.MONTH]: monthClassNames
      } = this.getClassNames();

      const disableControls =
         !this.props.snapshot.active ||
         !this.props.dateRange.start ||
         !this.props.dateRange.end;

      const showError =
         this.props.snapshot.active &&
         (!this.props.dateRange.start || !this.props.dateRange.end);

      const controlClassNames = ["Control--supersub"];
      disableControls && controlClassNames.push("Control--inactive");

      return (
         <Control.Sub
            className="SnapshotControl"
            title="Snapshot"
            icon={<InfoIcon />}
            helpText="The snapshot control allows for panning over the time period specified in the date range. Keep in mind that this may negate the effects of other time restrictions."
         >
            {/* Downloading Modal */}
            {this.state.isDownloading && (
               <DownloadingModal
                  text={this.state.downloadStage}
                  fill={this.state.downloadProgress}
               />
            )}

            {/* Active Toggle */}
            <Toggle
               checked={this.props.snapshot.active}
               onChange={this.props.toggle.bind(this)}
               icons={{ checked: <noscript />, unchecked: <noscript /> }}
            />

            {/* Error Message */}
            {showError && (
               <div className="block-error" style={{ marginBottom: "15px" }}>
                  You must select a start and an end date for the date range to
                  use the snapshot feature.
               </div>
            )}

            {/* Resolution */}
            <Control.SuperSub
               className={controlClassNames.join(" ")}
               title="Resolution"
            >
               <div className="btn-group">
                  <button
                     type="button"
                     className={dayClassNames}
                     disabled={disableControls}
                     onClick={() => this.props.updateResolution(RESOLUTION.DAY)}
                  >
                     Day
                  </button>
                  <button
                     type="button"
                     className={weekClassNames}
                     disabled={disableControls}
                     onClick={() =>
                        this.props.updateResolution(RESOLUTION.WEEK)
                     }
                  >
                     Week
                  </button>
                  <button
                     type="button"
                     className={monthClassNames}
                     disabled={disableControls}
                     onClick={() =>
                        this.props.updateResolution(RESOLUTION.MONTH)
                     }
                  >
                     Month
                  </button>
               </div>
            </Control.SuperSub>

            {/* Slider Content */}
            <Control.SuperSub
               className={controlClassNames.join(" ")}
               title="Snapshot"
            >
               {/* Slider */}
               <Slider
                  disabled={disableControls}
                  className="time-slider"
                  max={this.getMaxValue()}
                  value={this.props.snapshot.slider}
                  onChange={this.throttledUpdateSlider.bind(this)}
               />
               <p className="text-center">{this.getSliderText()}</p>

               {/* Play/Download Buttons */}
               <div className="btn-group">
                  {/* Play */}
                  <CompanionButton
                     buttonText={this.state.isPlaying ? "Stop" : "Play"}
                     onClick={this.handlePlayClick.bind(this)}
                     onCompanionSelect={this.onCompanionSelect.bind(this)}
                     companionIcon={
                        <DownCaret size={20} className="dark-icon" />
                     }
                     disabled={disableControls || this.state.isDownloading}
                     companionOptions={[
                        { value: 100, label: "Fast (10 fps)" },
                        { value: 250, label: "Regular (4 fps)" },
                        { value: 1000, label: "Slow (1 fps)" }
                     ]}
                  />

                  {/* Download */}
                  <button
                     type="button"
                     className="btn"
                     disabled={disableControls || this.state.isPlaying}
                     onClick={this.downloadHeatmap.bind(this)}
                  >
                     {this.state.isDownloading ? "Downloading..." : "Download"}
                  </button>
               </div>
            </Control.SuperSub>
         </Control.Sub>
      );
   }
}

export default connect(
   ({ constraints: { snapshot, dateRange } }) => ({ snapshot, dateRange }),
   {
      toggle: constraintActions.snapshot.toggle,
      updateSlider: constraintActions.snapshot.slider.update,
      updateResolution: constraintActions.snapshot.resolution.update
   }
)(SnapshotControl);
