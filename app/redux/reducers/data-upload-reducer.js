import { DATA_UPLOAD } from "../constants";

const INITIAL_STATE = {
   upload: null,
   data: [],
   ignored: [],
   tableConfig: {}
};

export default function(state = INITIAL_STATE, action) {
   switch (action.type) {
      case DATA_UPLOAD.DATA.UPDATE:
         return {
            ...state,
            upload: action.payload.upload,
            data: action.payload.data
         };
      case DATA_UPLOAD.DATA.CLEAR:
         return {
            ...state,
            upload: INITIAL_STATE.upload,
            data: INITIAL_STATE.data
         };
      case DATA_UPLOAD.IGNORED.ADD:
         return { ...state, ignored: [...state.ignored, action.payload] };
      case DATA_UPLOAD.IGNORED.REMOVE:
         return {
            ...state,
            ignored: state.ignored.filter(col => col !== action.payload)
         };
      case DATA_UPLOAD.IGNORED.UPDATE:
         return { ...state, ignored: action.payload };
      case DATA_UPLOAD.IGNORED.CLEAR:
         return { ...state, ignored: INITIAL_STATE.ignored };
      case DATA_UPLOAD.TABLE_CONFIG.UPDATE:
         if (action.payload.timeColumn)
            action.payload.timeUnits = state.tableConfig.timeUnits || "s";
         return {
            ...state,
            tableConfig: { ...state.tableConfig, ...action.payload }
         };
      case DATA_UPLOAD.TABLE_CONFIG.CLEAR:
         return { ...state, tableConfig: INITIAL_STATE.tableConfig };
      default:
         return state;
   }
}
