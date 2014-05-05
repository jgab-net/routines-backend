var express = require('express'),
    http = require('http'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    fs = require('fs');

mongoose.connect('mongodb://localhost/routines');

mongoose.connection.on('error', function(){
    throw new Error('unable to connect to database');
});

var modelsPath = __dirname + '/models';
fs.readdirSync(modelsPath).forEach(function (file) {
    if (file.indexOf('.js') >= 0) {
        require(modelsPath + '/' + file);
    }
});

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));
    app.use(express.bodyParser({ uploadDir:'./uploads' }));
    app.use(express.methodOverride());
    app.use(express.json());
    app.use('/uploads', express.static(__dirname + '/uploads'));

    app.use(cors());
    app.use(app.router);

    app.use(function (err, req, res, next) {
        req.accepts('json');

        if (!err) next();
        res.json({
            message: err.message,
            success: false
        }, err.status);
    });
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

var exercises = require('./routes/exercises');

app.get('/exercise', exercises.index);
app.get('/exercise/:id', exercises.show);
app.post('/exercise', exercises.store);
app.del('/exercise/:id',exercises.destroy);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
