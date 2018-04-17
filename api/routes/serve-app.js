/**
 * Serves the react application if there isn't an explicit
 * match to another route in the application
 * @param {request} req - a request object
 * @param {response} res - a response object
 */
function renderApplication(req, res) {
   let bundleName =
      process.env.NODE_ENV === "production" ? "bundle.prod.js" : "bundle.js";

   res.render("index", { bundleName });
}

module.exports = function(app) {
   app.get("*", renderApplication);
};
