const classesRoutes = require('./classes');
const userRoutes = require('./users');
const imageRoutes = require('./image')

const constructorMethod = (app) => {
	app.use('/classes', classesRoutes);
	app.use('/users', userRoutes);
	app.use('/image', imageRoutes);
};

module.exports = constructorMethod;