export const RESOLUTION = {
   DAY: "RESOLUTION/DAY",
   WEEK: "RESOLUTION/WEEK",
   MONTH: "RESOLUTION/MONTH"
};

export const HEATMAP_DATA_TYPE = {
   ARRIVAL: "HEATMAP_DATA_TYPE/ARRIVAL",
   DEPARTURE: "HEATMAP_DATA_TYPE/DEPARTURE"
};

export const HEATMAP_GRADIENT = {
   ARRIVAL: {
      0.25: "rgba(246,249,251,1.0)",
      0.5: "rgba(216,234,251,1.0)",
      0.75: "rgba(146,195,244,1.0)",
      1.0: "rgba(77,157,237,1.0)"
   },
   DEPARTURE: {
      0.25: "rgba(254,240,237,1.0)",
      0.5: "rgba(254,211,204,1.0)",
      0.75: "rgba(253,147,128,1.0)",
      1.0: "rgba(252,82,53,1.0)"
   }
};

export const OVERLAY_STATUS = {
   ACTIVE: "OVERLAY_STATUS/ACTIVE",
   LOADING: "OVERLAY_STATUS/LOADING",
   INACTIVE: "OVERLAY_STATUS/INACTIVE"
};

export const TM_UNITS = {
   DATE: {
      value: "date",
      label: "date (dt)"
   },
   MILLIS: {
      value: "ms",
      label: "milliseconds (ms)"
   },
   SECONDS: {
      value: "s",
      label: "seconds (s)"
   }
};

export const PROCESSING_MSG = {
   PROCESSING: "Data is being processed...",
   UPLOADING: "Processing complete. Uploading data..."
};

export const ACCEPTED_TYPES = {
   CSV: "text/csv",
   TSV: "text/tsv",
   JSON: "application/json",
   MS_CSV: "application/vnd.ms-excel"
};

export const TRIP_SIDE = {
   ARRIVAL: 1,
   DEPARTURE: 0
};

export const DOWNLOAD_STAGE = {
   GETTING_TILES: {
      TEXT: "Laying out map tiles...",
      VALUE: 20
   },
   GENERATING_FRAMES: {
      TEXT: "Generating frames to download...",
      VALUE: 40
   },
   GENERATING_BLOBS: {
      TEXT: "Processing frames...",
      VALUE: 60
   },
   GENERATING_GIF: {
      TEXT: "Combining frames into GIF...",
      VALUE: 80
   },
   DOWNLOADING_FILE: {
      TEXT: "Downloading file...",
      VALUE: 100
   }
};

export const THROTTLE_THRES = 50;

export const PLAY_ANIM = {
   MIN_WAIT: 250
};

export const TIME_OF_DAY = {
   DEPARTURE: "departure",
   ARRIVAL: "arrival"
};
