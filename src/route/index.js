const crudRoutes = require('./crudRoutes');


function router(app) {
    app.use('/', crudRoutes);
  
}
module.exports = router;