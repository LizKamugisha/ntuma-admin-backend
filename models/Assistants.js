// const mongoose = require("mongoose");

// const assistantsSchema = new mongoose.Schema({
//   firstName: String,
//   surName: String,
//   gender: String,
//   phone: String,
//   address: String,
//   market: String,
//   refNumber: String,
//   profile_pic: String,
//   password: String,
//   confirm_password: String,
//   email: String,
// });

// module.exports = mongoose.model("Assistants", assistantsSchema);

const mongoose = require('mongoose');

const assistantSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    // passwordHash: {
    //     type: String,
    //     required: true,
    // },
    
    // isAssistant: {
    //     type: Boolean,
    //     default: false,
    // },
    address: {
        type: String,
        default: ''
    },
    market: {
        type: String,
        default: ''
    }

});

assistantSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

assistantSchema.set('toJSON', {
    virtuals: true,
});

exports.Assistant = mongoose.model('Assistant', assistantSchema);
exports.assistantSchema = assistantSchema;