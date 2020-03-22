const Sequelize = require('sequelize');
const sequelize = new Sequelize('simpleChat', 'postgres', 'maatisfet', {
    host: 'localhost',
    dialect: 'postgres',
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

//Test database connection
sequelize.authenticate()
    .then(() => console.log('Database successfully connected!'))
    .catch(error => console.log(`Error: ${error}`))

module.exports = {
    db: sequelize
}