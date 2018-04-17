// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import L from "leaflet";

// custom modules
import DataOverlayBlock from "./DataOverlayBlock";
import ColorPicker from "components/ColorPicker";
import {
   randomColor,
   formatTimeRestrictions,
   mapUtils,
   generateHeatmapGradient
} from "utils";

class DataPointsOverlay extends Component {
   static propTypes = {
      tableName: PropTypes.string.isRequired,
      latitudeColumn: PropTypes.string.isRequired,
      longitudeColumn: PropTypes.string.isRequired,
      map: PropTypes.object.isRequired,
      timeColumn: PropTypes.string,
      timeUnits: PropTypes.string
   };

   buildQuery(dataRange, snapshot) {
      const {
         latitudeColumn,
         longitudeColumn,
         tableName,
         timeColumn,
         timeUnits
      } = this.props;
      const { dateRange = {} } = formatTimeRestrictions(
         dataRange || this.props.constraints.dateRange,
         snapshot || this.props.constraints.snapshot
      );

      let baseQuery = `
			SELECT ${latitudeColumn}, ${longitudeColumn}
				FROM ${tableName}
		`;

      if (timeColumn && timeUnits && (dateRange.start || dateRange.end)) {
         const clauses = [];

         if (dateRange.start)
            clauses.push(`${timeColumn} >= ${dateRange.start.unix()}`);
         if (dateRange.end)
            clauses.push(`${timeColumn} <= ${dateRange.end.unix()}`);
         if (clauses.length) {
            const whereClause = clauses.join(" AND ");
            baseQuery += `WHERE ${whereClause}`;
         }
      }
      return baseQuery;
   }

   queryForData(dateRange, snapshot) {
      const query = this.buildQuery(dateRange, snapshot);
      console.log(query);
      const [{ values = [] } = {}] = window.db.exec(query);
      return values;
   }

   loadHeatmap(dateRange, snapshot) {
      if (!this.heatmap) return;
      const data = this.queryForData(dateRange, snapshot);
      if (data.length) this.heatmap.setLatLngs(data);
   }

   loadPoints(dateRange, snapshot) {
      if (!this.layerGroup) return;
      const data = this.queryForData(dateRange, snapshot);
      if (data.length) {
         const icon = mapUtils.makeSimpleIcon(this.state.color);
         data.values.forEach(latLng => {
            L.marker(latLng, { icon }).addTo(this.layerGroup);
         });
      }
   }

   componentWillMount() {
      if (this.props.timeColumn && this.props.timeUnits) {
         this.heatmap = L.heatLayer([], {
            radius: 15,
            minOpacity: 0.5,
            gradient: generateHeatmapGradient(this.state.color)
         }).addTo(this.props.map);
         this.loadHeatmap();
      } else {
         this.layerGroup = L.layerGroup();
         this.props.map.addLayer(this.layerGroup);
         this.loadPoints();
      }
   }

   componentWillReceiveProps({
      constraints: { dateRange: nextDateRange = {}, snapshot: nextSnapshot }
   }) {
      const { constraints: { dateRange = {} } } = this.props;
      // wrapping in `moment` in case the values are null
      const dr = formatTimeRestrictions(nextDateRange, nextSnapshot);
      if (
         !moment(dr.start).isSame(moment(dateRange.start)) ||
         !moment(dr.end).isSame(moment(dateRange.end))
      ) {
         if (this.props.timeColumn && this.props.timeUnits) {
            this.loadHeatmap(nextDateRange, nextSnapshot);
         } else {
            this.loadPoints(nextDateRange, nextSnapshot);
         }
      }
   }

   componentWillUnmount() {
      if (this.layerGroup)
         this.layerGroup.eachLayer(l => this.layerGroup.removeLayer(l));
      if (this.heatmap) this.props.map.removeLayer(this.heatmap);
   }

   constructor(props) {
      super(props);

      this.state = {
         color: randomColor()
      };
   }

   colorChanged(color) {
      this.setState({ color });
      const icon = mapUtils.makeSimpleIcon(color);
      if (this.layerGroup) this.layerGroup.eachLayer(l => l.setIcon(icon));
      else if (this.heatmap)
         this.heatmap.setOptions({
            gradient: generateHeatmapGradient(this.state.color)
         });
   }

   render() {
      return (
         <DataOverlayBlock
            className="DataPointsOverlay"
            header={`${this.props.tableName} points`}
            color={this.state.color}
         >
            <ColorPicker
               initialColor={this.state.color}
               colorChanged={this.colorChanged.bind(this)}
            />
         </DataOverlayBlock>
      );
   }
}

export default connect(({ constraints }) => ({ constraints }))(
   DataPointsOverlay
);
