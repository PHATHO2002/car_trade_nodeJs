const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoute')
const siteRoutes = require('./siteRoute');

function router(app) {
    app.use('/user', userRoutes);
    app.use('/admin', adminRoutes);

    app.use('/', siteRoutes);
}
module.exports = router;