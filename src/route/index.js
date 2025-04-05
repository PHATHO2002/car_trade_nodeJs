const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoute');
const carRoutes = require('./carRoute');
const siteRoutes = require('./siteRoute');
const cartRoutes = require('./cartRoute');
const chatRoutes = require('./chatRoute');
function router(app) {
    app.use('/user', userRoutes);
    app.use('/admin', adminRoutes);
    app.use('/car', carRoutes);
    app.use('/chat', chatRoutes);
    app.use('/cart', cartRoutes);
    app.use('/', siteRoutes);
}
module.exports = router;
