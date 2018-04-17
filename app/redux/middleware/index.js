import fireRemoteQuery from "./fire-remote-query";
import fireLocalQuery from "./fire-local-query";

module.exports = {
   fireQuery: {
      remote: fireRemoteQuery,
      local: fireLocalQuery
   }
};
