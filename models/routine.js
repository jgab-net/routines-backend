var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var routinesSchema = new Schema({
    exercises: [
        { type: Schema.Types.ObjectId, ref: 'Exercise', required: true }
    ],
    date: { type: Date, required:true }
});

mongoose.model('Routine', routinesSchema);
