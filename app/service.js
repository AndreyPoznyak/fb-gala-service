var restify = require("restify"),
    db = require("./database");


//var dbActions = require("./db-actions");

exports.run = function () {
    var server = restify.createServer({
        name: "FB accounts service"
    });

    //TODO: add appropriate restify handlers
    server.use(restify.bodyParser()); //in order to get correct request params
    server.use(restify.jsonp()); //support jsonp

    server.post("/user", function (request, response, next) {
        console.log("posting user:");
        console.log(request.body);

        db.addUser(JSON.parse(request.body)).then(function (id) {
            response.send({
                success: true,
                id: id
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
            response.send(user);
        }, function (error) {
            response.send({
                success: false,
                error: error
            });
        });

        return next();
    });

    server.listen("8080", function () {
        console.log(server.name, " is listening at ", server.url);
    });
}