const classesRoutes = require('./classes');
const userRoutes = require('./users');

const constructorMethod = (app) => {
	app.use('/classes', classesRoutes);
	app.use('/users', userRoutes);
};

module.exports = constructorMethod;