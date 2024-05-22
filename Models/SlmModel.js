const mongoose = require("mongoose");

//Configure Slm model...
const SlmSchema = mongoose.Schema({
    slmId: {
        type: String,
        required: false
    },
    slmName: {
        type: String,
        required: false
    },
    slmPassword: {
        type: String,
        required: false
    },
    slmGender: {
        type: String,
        required: false
    },
    slmNumber: {
        type: String,
        required: false
    },
    FLM: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Flm' }
    ],
    DateOfCreation: {
        type: String,
        default: () => {
            const currentDate = new Date();
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = currentDate.getFullYear();
            return `${day}/${month}/${year}`;
        }
    },
});


const slmModel = mongoose.model("Slm", SlmSchema);


module.exports = slmModel;