const userRoutes = require('./userRoutes');
const siteRoutes = require('./siteRoute');

function router(app) {
    app.use('/user', userRoutes);
    app.use('/', siteRoutes);
}
module.exports = router;