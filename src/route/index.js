const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoute');
const carRoutes = require('./carRoute');
const siteRoutes = require('./siteRoute');

function router(app) {
    app.use('/user', userRoutes);
    app.use('/admin', adminRoutes);
    app.use('/car', carRoutes);

    app.use('/', siteRoutes);
}
module.exports = router;
