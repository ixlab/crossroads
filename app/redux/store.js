// external modules
import { createStore, applyMiddleware } from "redux";
import ReduxPromise from "redux-promise";
import ReduxThunk from "redux-thunk";

// custom modules
import reducers from "./reducers";
import { fireQuery } from "./middleware";

// dev modules
import { createLogger } from "redux-logger";

const logger = createLogger({
   collapsed: true
});

export default applyMiddleware(
   ReduxPromise,
   ReduxThunk,
   logger,
   fireQuery.remote,
   fireQuery.local
)(createStore)(reducers);
