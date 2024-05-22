const mongoose = require("mongoose");

//Configure Flm model...
const FlmSchema = mongoose.Schema({
    flmId: {
        type: String,
        required: false
    },
    flmName: {
        type: String,
        required: false
    },
    flmEmail: {
        type: String,
        required: false
    },
    flmPassword: {
        type: String,
        required: false
    },
    flmGender: {
        type: String,
        required: false
    },
    flmNumber: {
        type: String,
        required: false
    },
    ppmPlanning: [{
        ppmDate: String,
        speakerName: String,
        scCode: String,
        doctorSpec: String,
        place: String,
        noOfAttedance: String,
        venueName: String,
        brandName: String,
        hotelReqSendDate: String,
        paymentMode: String,
        advanceReqDate: String,
        ppmCost: String,
        saved: Boolean,
        submit: Boolean,
        ppmStatus: String
    }],
    ppmFeedback: [{
        planMode:String,
        plannedDate:String,
        plannedSpkName:String,
        accPPMDate:String,
        accSpkName:String,
        scCode:String,
        doctorSpec:String,
        place:String,
        noOfAttedance:String,
        venueName:String,
        brandName:String,
        topic:String,
        highlight:String,
        totalExpenses:String,
        advanceReceive:String,
        addAmount:String,
        expensesWithoutBills:String,
        expensesWithBills:[{
            desc:String,
            billNo:String,
            billDate:String,
            amount:String,
            expenseFile:String
        }],
        attedanceList:[{
            name:String,
            scCode:String,
            speciality:String
        }],
        eventPhotos:[{
            fileName:String
        }]
    }],
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


const flmModel = mongoose.Model("Flm", FlmSchema);


module.exports = flmModel;