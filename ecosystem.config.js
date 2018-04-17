module.exports = {
   apps: [
      {
         name: "Crossroads",
         script: "./prod/index.js",
         env_staging: {
            PORT: 8080,
            NODE_ENV: "development"
         },
         env_production: {
            PORT: 80,
            NODE_ENV: "production"
         }
      }
   ]
};
