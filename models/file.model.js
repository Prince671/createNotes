const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    title:String,
    desc:String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // fixed: collection name should match the model name (assuming model is named 'user')
        required: [true, "userId is required"]
    }
})

const file = mongoose.model('file', fileSchema);

module.exports = file;
