var mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    Exercise = mongoose.model('Exercise');

exports.index = function(req, res, next){
    Exercise.find({}, function(err, exercises){
       if(err) return next({ message:'UnhandledError', status:400 });
        res.json(exercises);
    });
};

exports.show = function(req, res, next){
    Exercise.findById(req.params.id,function(err, exercise){
        if(err) return next({ message:'UnhandledError', status:400 });
        if(!exercise) return next({ message:'ExerciseNotFound', status:400 });

        console.log(exercise.image.url);
        res.json(exercise);
    });
};

exports.store = function(req, res, next){

    var exercise = new Exercise();
    exercise.image.path = 'uploads/image_'+exercise._id+path.extname(req.files.image.name);

    fs.rename(req.files.image.path,'./'+exercise.image.path, function(err){
        if(err) {
            fs.unlink(req.files.image.path, function(unlinkErr) {
                if(unlinkErr) {
                    return next({ message:'UnlinkFail', status:400 });
                }
                return next({ message:'RenameFail', status:400 });
            });
        }else{

            exercise.title = req.body.title;
            exercise.description = req.body.description;

            exercise.save(function (err, savedExercise) {
                if (err) {
                    fs.unlink('./' + exercise.image.path, function (unlinkErr) {
                        if (unlinkErr) {
                            return next({ message: 'UnlinkFail', status: 400 });
                        }
                        return next({ message: 'DuplicatedExercise', status: 400 });
                    });
                } else {
                    res.json(savedExercise);
                }
            });
        }
    });
};

exports.destroy = function(req, res, next){
    Exercise.findByIdAndRemove(req.params.id,function(err, exercise){
        if(err) return next({ message: 'RemoveExerciseFail'});
        console.log(exercise);
        res.end();
    });
};