// external modules
import { combineReducers } from "redux";

// custom modules
import timestamps from "./timestamp-reducer";
import vehicles from "./vehicle-reducer";
import controls from "./control-reducer";
import constraints from "./constraint-reducer";
import dataUpload from "./data-upload-reducer";

const rootReducer = combineReducers({
   timestamps,
   vehicles,
   controls,
   constraints,
   dataUpload
});

export default rootReducer;
