const slmModel = require("../Models/SlmModel");
const tlmModel = require("../Models/TlmModel");
const jwt = require("jsonwebtoken");



//Register Controller....
const slmRegister = async (req, res) => {
    try {
        //Check admin exist or not....
        const tlmID = req.params.id;
        const tlmExist = await tlmModel.findById(tlmID);
        if (!tlmExist) {
            return res.status(404).send({ message: "Tlm not found..!!", success: false });
        }

        //Handle new tlm data...
        const { slmID, slmNAME, slmPASSWORD, slmGENDER, slmNUMBER } = req.body;

        //Check tlm exist or not...
        const slmExist = await slmModel.findOne({ slmId: slmID });
        if (slmExist) {
            return res.status(501).send({ message: "Slm already exist..!!", success: false });
        }

        //Formated data before store....
        const formatedData = {
            slmId: slmID,
            slmName: slmNAME,
            slmPassword: slmPASSWORD,
            slmGender: slmGENDER,
            slmNumber: slmNUMBER,
        }

        //Save new slm entry in database....
        const newSlm = new slmModel(formatedData);
        await newSlm.save();

        //Store new slm id to admin model...
        tlmExist.SLM.push(newSlm._id);
        await tlmExist.save();

        res.status(201).send({ message: "New Slm register successfully..", success: true });

    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to register new tlm...!!", success: false });
    }
}


//Login Controller....
const slmLogin = async (req, res) => {
    try {
        const { ID, PASSWORD } = req.body;

        //Check the admin Exist or not..
        const slmExist = await slmModel.findOne({ slmId: ID });
        if (!slmExist) {
            return res.status(404).send({ message: "SLM Not Exist...!!!", success: false });
        }

        //Check the password length...
        if (PASSWORD.length < 5) {
            return res.status(500).send({ message: "Password length must be greater than 5 letter..!!!", success: false });
        }

        //Check the password match or not...
        if (slmExist.slmPassword !== PASSWORD) {
            return res.status(500).send({ message: "Invalid Credentials Failed to login..!!", success: false });
        }

        //Generate token after login...
        const token = jwt.sign({ id: slmExist._id }, process.env.SECRETKEY, {
            expiresIn: "1d"
        });

        //Final all ok give response..
        res.status(201).send({ message: "Slm Successfully Login...", success: true, token, slmExist });

    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to login slm...!!!", success: false });
    }
}



module.exports = {
    slmRegister,
    slmLogin
}