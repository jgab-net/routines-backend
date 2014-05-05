var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExercisesSchema = new Schema({
    image: {
        path: { type:String, required:true }
    },
    title: { type:String, required:true, index:{ unique:true, dropDups:true } },
    description: { type:String }
},{
    toObject: {
        virtuals: true
    },toJSON: {
        virtuals: true
    }
});

ExercisesSchema.virtual('image.url').get(function () {
    return 'http://localhost:3000/'+this.image.path;
});

mongoose.model('Exercise', ExercisesSchema);