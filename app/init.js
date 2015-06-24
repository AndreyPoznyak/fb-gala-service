
var db = require("./database"),
    service = require("./service");

var sequelize = db.sequelize;

sequelize.authenticate().then(function() {
    console.log('Connection with database has been established successfully.')
    db.defineTables().then(function () {
        service.run();
    });
}, function (error) {
    console.log('Unable to connect to the database: ', error)
});

