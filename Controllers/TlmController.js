const tlmModel = require("../Models/TlmModel");
const adminModel = require("../Models/AdminModel");
const jwt = require("jsonwebtoken");




//Register Controller....
const tlmRegister = async (req, res) => {
    try {
        //Check admin exist or not....
        const adminID = req.params.id;
        const adminExist = await adminModel.findById(adminID);
        if (!adminExist) {
            return res.status(404).send({ message: "Admin not found..!!", success: false });
        }

        //Handle new tlm data...
        const { tlmID, tlmNAME, tlmPASSWORD, tlmGENDER, tlmNUMBER } = req.body;

        //Check tlm exist or not...
        const tlmExist = await tlmModel.findOne({ tlmId: tlmID });
        if (tlmExist) {
            return res.status(501).send({ message: "Tlm already exist..!!", success: false });
        }

        //Formated data before store....
        const formatedData = {
            tlmId: tlmID,
            tlmName: tlmNAME,
            tlmPassword: tlmPASSWORD,
            tlmGender: tlmGENDER,
            tlmNumber: tlmNUMBER,
        }

        //Save new tlm entry in database....
        const newTlm = new tlmModel(formatedData);
        await newTlm.save();

        //Store new tlm id to admin model...
        adminExist.TLM.push(newTlm._id);
        await adminExist.save();

        res.status(201).send({ message: "New tlm register successfully..", success: true });

    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to register new tlm...!!", success: false });
    }
}

//Login Controller....
const tlmLogin = async (req, res) => {
    try {
        const { ID, PASSWORD } = req.body;

        //Check the admin Exist or not..
        const tlmExist = await tlmModel.findOne({ tlmId: ID });
        if (!tlmExist) {
            return res.status(404).send({ message: "TLM Not Exist...!!!", success: false });
        }

        //Check the password length...
        if (PASSWORD.length < 5) {
            return res.status(500).send({ message: "Password length must be greater than 5 letter..!!!", success: false });
        }

        //Check the password match or not...
        if (tlmExist.tlmPassword !== PASSWORD) {
            return res.status(500).send({ message: "Invalid Credentials Failed to login..!!", success: false });
        }

        //Generate token after login...
        const token = jwt.sign({ id: tlmExist._id }, process.env.SECRETKEY, {
            expiresIn: "1d"
        });

        //Final all ok give response..
        res.status(201).send({ message: "Tlm Successfully Login...", success: true, token, tlmExist });

    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to login tlm...!!!", success: false });
    }
}



module.exports = {
    tlmRegister,
    tlmLogin
}