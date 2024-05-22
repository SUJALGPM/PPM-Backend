const mongoose = require("mongoose");

//Configure Tlm model...
const TlmSchema = mongoose.Schema({
    tlmId: {
        type: String,
        required: false
    },
    tlmName: {
        type: String,
        required: false
    },
    tlmPassword: {
        type: String,
        required: false
    },
    tlmGender: {
        type: String,
        required: false
    },
    tlmNumber: {
        type: String,
        required: false
    },
    SLM: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Slm' }
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


const tlmModel = mongoose.model("Tlm", TlmSchema);


module.exports = tlmModel;