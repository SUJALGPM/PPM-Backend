const slmModel = require("../Models/SlmModel");
const flmModel = require("../Models/FlmModel");
const jwt = require("jsonwebtoken");



//Register Controller....
const flmRegister = async (req, res) => {
    try {
        //Check slm exist or not....
        const slmID = req.params.id;
        const slmExist = await slmModel.findById(slmID);
        if (!slmExist) {
            return res.status(404).send({ message: "Slm not found..!!", success: false });
        }

        //Handle new tlm data...
        const { flmID, flmNAME, flmPASSWORD, flmGENDER, flmNUMBER } = req.body;

        //Check flm exist or not...
        const flmExist = await flmModel.findOne({ flmId: flmID });
        if (flmExist) {
            return res.status(501).send({ message: "Flm already exist..!!", success: false });
        }

        //Formated data before store....
        const formatedData = {
            flmId: flmID,
            flmName: flmNAME,
            flmPassword: flmPASSWORD,
            flmGender: flmGENDER,
            flmNumber: flmNUMBER,
        }

        //Save new flm entry in database....
        const newFlm = new flmModel(formatedData);
        await newFlm.save();

        //Store new flm id to slm model...
        slmExist.FLM.push(newFlm._id);
        await slmExist.save();

        res.status(201).send({ message: "New Flm register successfully..", success: true });

    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to register new tlm...!!", success: false });
    }
}

//Login Controller....
const flmLogin = async (req, res) => {
    try {
        const { ID, PASSWORD } = req.body;

        //Check the admin Exist or not..
        const flmExist = await flmModel.findOne({ flmId: ID });
        if (!flmExist) {
            return res.status(404).send({ message: "FLM Not Exist...!!!", success: false });
        }

        //Check the password length...
        if (PASSWORD.length < 5) {
            return res.status(500).send({ message: "Password length must be greater than 5 letter..!!!", success: false });
        }

        //Check the password match or not...
        if (flmExist.flmPassword !== PASSWORD) {
            return res.status(500).send({ message: "Invalid Credentials Failed to login..!!", success: false });
        }

        //Generate token after login...
        const token = jwt.sign({ id: flmExist._id }, process.env.SECRETKEY, {
            expiresIn: "1d"
        });

        //Final all ok give response..
        res.status(201).send({ message: "Flm Successfully Login...", success: true, token, flmExist });

    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to login slm...!!!", success: false });
    }
}

//Create Planned....
const createPlan = async (req, res) => {
    try {
        const flmId = req.params.id;
        const { ppmDate, speakerName, scCode, doctorSpec, place, noOfAttedance, venueName, brandName, hotelReqSendDate, paymentMode, advanceReqDate, ppmCost, plannedTrack } = req.body;


        //Check flm exist or not...
        const flmExist = await flmModel.findById(flmId);
        if (!flmExist) {
            return res.status(501).send({ message: "Flm not found..!!", success: false });
        }

        //Configure planned status track saved || submit....
        if (plannedTrack === true) {
            const saved = true
        } else {
            const submit = false
        }

        //Formated planned data...
        const formatedData = {
            ppmDate: ppmDate,
            speakerName: speakerName,
            scCode: scCode,
            doctorSpec: doctorSpec,
            place: place,
            noOfAttedance: noOfAttedance,
            venueName: venueName,
            brandName: brandName,
            hotelReqSendDate: hotelReqSendDate,
            paymentMode: paymentMode,
            advanceReqDate: advanceReqDate,
            ppmCost: ppmCost,
            plannedTrack: plannedTrack
        }



    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to create plan...!!", success: false });
    }
}





module.exports = {
    flmRegister,
    flmLogin,
    createPlan
}