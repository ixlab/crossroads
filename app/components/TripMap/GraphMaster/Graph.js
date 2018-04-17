// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Bar as BarChart, Line } from "react-chartjs-2";
import DownloadIcon from "react-icons/lib/fa/download";

// custom modules
import {
   lightColor,
   graphHeight,
   graphWidth
} from "!!sass-variable-loader!scss-variables";
import { cssDimensionToInt, downloadUtils, hexToRgba } from "utils";

export default class Graph extends Component {
   static propTypes = {
      data: PropTypes.array,
      xAttr: PropTypes.string,
      yAttr: PropTypes.string,
      title: PropTypes.string,
      color: PropTypes.string
   };

   constructor(props) {
      super(props);

      this.xAttr = props.xAttr;
      this.yAttr = props.yAttr;
      this.title = props.title;
   }

   _formatChartJSData(data) {
      data = data.filter(i => i[this.xAttr] || i[this.yAttr]);
      data = data.sort((a, b) => a[this.xAttr] - b[this.xAttr]);

      return {
         labels: data.map(item => item[this.xAttr]),
         datasets: [
            {
               label: this.title,
               data: data.map(item => item[this.yAttr]),
               backgroundColor: hexToRgba(this.props.color, 0.5),
               borderColor: this.props.color
            }
         ]
      };
   }

   downloadChart() {
      if (this.graph) {
         const [canvas] = this.graph.getElementsByTagName("canvas") || [];
         if (canvas) {
            const final = document.createElement("canvas");
            const padding = 50;
            const topMargin = 20;
            final.width = canvas.width + padding;
            final.height = canvas.height + padding + topMargin;
            const ctx = final.getContext("2d");

            ctx.fillStyle = lightColor;
            ctx.rect(0, 0, final.width, final.height);
            ctx.fill();

            ctx.drawImage(canvas, padding / 2, padding / 2 + topMargin);

            const watermark = downloadUtils.generateWatermark(
               null,
               final.width,
               final.height
            );
            ctx.drawImage(watermark, 0, 0);

            downloadUtils.downloadFromCanvas(final);
         }
      }
   }

   render() {
      return (
         <div className="Graph" ref={graph => (this.graph = graph)}>
            <div
               className="Graph__Download"
               onClick={this.downloadChart.bind(this)}
            >
               <DownloadIcon className="dark-icon" size={16} />
            </div>
            <Line
               data={this._formatChartJSData(this.props.data)}
               height={cssDimensionToInt(graphHeight)}
               width={cssDimensionToInt(graphWidth)}
               options={{ maintainAspectRatio: false }}
            />
         </div>
      );
   }
}
