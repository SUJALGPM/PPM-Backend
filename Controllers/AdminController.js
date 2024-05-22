const adminModel = require("../Models/AdminModel");
const jwt = require("jsonwebtoken");



//Register Controller...
const adminRegister = async (req, res) => {
    try {
        const { ID, NAME, GENDER, NUMBER, PASSWORD } = req.body;

        //Check the admin already exist or not..
        const adminExist = await adminModel.findOne({ adminId: ID });
        if (adminExist) {
            return res.status(500).send({ message: "Admin Already Exist..!!!", success: false });
        }

        //Format data before store...
        const formatData = {
            adminId: ID,
            adminName: NAME,
            adminPassword: PASSWORD,
            adminGender: GENDER,
            adminNumber: NUMBER
        }

        //Store in database...
        const createNewAdmin = new adminModel(formatData);
        const savedAdmin = await createNewAdmin.save();

        res.status(201).send({ message: "New Admin Create Successfully", success: true, data: savedAdmin });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to create a new Admin..!!!", success: false });
    }
}

//Login Controller.....
const adminLogin = async (req, res) => {
    try {
        const { ID, PASSWORD } = req.body;

        //Check the admin Exist or not..
        const adminExist = await adminModel.findOne({ adminId: ID });
        if (!adminExist) {
            return res.status(404).send({ message: "Admin Not Exist...!!!", success: false });
        }

        //Check the password length...
        if (PASSWORD.length < 5) {
            return res.status(500).send({ message: "Password length must be greater than 5 letter..!!!", success: false });
        }

        //Check the password match or not...
        if (adminExist.adminPassword !== PASSWORD) {
            return res.status(500).send({ message: "Invalid Credentials Failed to login..!!", success: false });
        }

        //Generate token after login...
        const token = jwt.sign({ id: adminExist._id }, process.env.SECRETKEY, {
            expiresIn: "1d"
        });

        //Final all ok give response..
        res.status(201).send({ message: "Admin Successfully Login...", success: true, token, adminExist });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Admin Failed to login..!!!", success: false });
    }
}






module.exports = {
    adminRegister,
    adminLogin
}