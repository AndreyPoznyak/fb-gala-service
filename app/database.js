//error codes
//1 - trying to add user that already exists
//2 - not able to find the user with provided FB ID



var Sequelize = require("sequelize"),
    Q = require("q");

//connecting without password
var sequelize = new Sequelize('fb-accounts', 'root', null, {
    dialect: "mysql"
});

var User = sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    facebookId: Sequelize.STRING
}, {
    timestamps: true
});

exports.sequelize = sequelize;

var force = false;           //forcing the tables to be created from the beggining

exports.defineTables = function () {
    var deferred = Q.defer();

    sequelize.sync({ force: force }).then(function() {
        console.log('All tables created!');
        deferred.resolve();
    }, function (error) {
        console.log('An error occurred while creating the tables: ', error);
        deferred.reject();
    });

    return deferred.promise;
};

exports.addUser = function (info) {
    var deferred = Q.defer();

    if (info.id) {
        User.max("id").then(function (id) {
            console.log("max id now is: ", id);
            var newId = id + 1,
                username = "fbgala" + newId,
                password = "fbpass" + newId;

            User.findOrCreate({
                where: {
                    facebookId: info.id
                },
                defaults: {
                    username: username,
                    password: password
                }
            }).spread(function (user, created) {
                if (created) {
                    console.log("user added to db: ", user);
                    deferred.resolve({
                        id: user.id,
                        username: username,
                        password: password
                    });
                } else {
                    console.log("user already exists");
                    deferred.reject({
                        errorCode: 1,
                        message: "Sorry, but this user already exists"
                    });
                }
            });
        });
    } else {
        deferred.reject("not enough info for creating new user");
    }

    return deferred.promise;
};

exports.getUser = function (id) {
    var deferred = Q.defer();

    if (id) {
        User.find({where: {
            facebookId: id
        }}).then(function (user) {
            if (user) {
                deferred.resolve(user);
            } else {
                console.log("not able to find the user");
                deferred.reject({
                    errorCode: 2,
                    message: "Sorry, please register first"
                });
            }
        });
    } else {
        deferred.reject("not enough info for getting the user");
    }

    return deferred.promise;
};



//one-to-many relations
//Hotspot.hasMany(Coordinate);
//Coordinate.hasMany(Hotspot);
//
//Hotspot.belongsTo(User);
//User.hasMany(Hotspot);

//exports.User = User;