var restify = require("restify"),
    db = require("./database");

exports.run = function () {
    var server = restify.createServer({
        name: "FB accounts service"
    });

    //TODO: add appropriate restify handlers
    server.use(restify.bodyParser()); //in order to get correct request params
    //server.use(restify.jsonp()); //support jsonp
    server.use(restify.CORS());  //set it up properly

    //jsonp supports only GET method
    //server.get("/newuser", function (request, response, next) {

    server.post("/user", function (request, response, next) {
        console.log("posting user:");
        console.log(request.params);

        db.addUser(request.params).then(function (info) {
            response.send({
                success: true,
                user: info
            });
        }, function (error) {
            response.send({
                success: false,
                error: error
            });
        });

        return next();
    });

    server.put("/user/:id/registered", function (request, response, next) {
        var id = request.params.id;

        console.log("marking user as registered:");
        console.log(id);

        db.markUserRegistered(id).then(function () {
            response.send({
                success: true
            });
        }, function (error) {
            response.send({
                success: false,
                error: error
            });
        });

        return next();
    });

    server.get("/user/:id", function (request, response, next) {
        var id = request.params.id;
        console.log("getting user:");
        console.log(id);

        db.getUser(id).then(function (user) {
            response.send({
                success: true,
                user: user
            });
        }, function (error) {
            response.send({
                success: false,
                error: error
            });
        });

        return next();
    });

    server.listen("3000", function () {
        console.log(server.name, " is listening at ", server.url);
    });
}