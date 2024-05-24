const slmModel = require("../Models/SlmModel");
const flmModel = require("../Models/FlmModel");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const moment = require("moment");



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
        const { flmID, flmNAME, flmPASSWORD, flmGENDER, flmNUMBER, HQ, area, region, zone } = req.body;

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
            HQ: HQ,
            area: area,
            region: region,
            zone: zone
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
        const { ppmDate, speakerName, scCode, doctorSpec, place, noOfAttedance, venueName, brandName, hotelReqSendDate, paymentMode, advanceReqDate, ppmCost } = req.body;


        //Check flm exist or not...
        const flmExist = await flmModel.findById(flmId);
        if (!flmExist) {
            return res.status(501).send({ message: "Flm not found..!!", success: false });
        }

        // //Configure planned status track saved || submit....
        const allFieldsPresent = ppmDate && speakerName && scCode && doctorSpec && place && noOfAttedance && venueName && brandName && hotelReqSendDate && paymentMode && advanceReqDate && ppmCost;

        // Set ppmStatus based on the presence of all fields
        const statusCheck = allFieldsPresent ? true : false;


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
            ppmStatus: statusCheck
        }


        //Save new flm plan...
        flmExist.ppmPlanning.push(formatedData);
        await flmExist.save();

        res.status(201).send({ message: "New FLM plan create successfully..", success: true });


    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to create plan...!!", success: false });
    }
}

//Update already created ppmPlanning plan...
const updatePlan = async (req, res) => {
    try {
        const flmId = req.params.flmId;
        const planId = req.params.planId;
        const { ppmDate, speakerName, scCode, doctorSpec, place, noOfAttedance, venueName, brandName, hotelReqSendDate, paymentMode, advanceReqDate, ppmCost, statusCheck } = req.body;

        // Check if FLM exists
        const flmExist = await flmModel.findById(flmId);
        if (!flmExist) {
            return res.status(404).send({ message: "FLM not found", success: false });
        }

        // Find the plan to update
        const plan = flmExist.ppmPlanning.id(planId);
        if (!plan) {
            return res.status(404).send({ message: "Plan not found", success: false });
        }

        // Update ppmModifiedDate with current date in "dd-mm-yyyy" format....
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();


        // Update the plan with the new data
        plan.ppmDate = ppmDate || plan.ppmDate;
        plan.speakerName = speakerName || plan.speakerName;
        plan.scCode = scCode || plan.scCode;
        plan.doctorSpec = doctorSpec || plan.doctorSpec;
        plan.place = place || plan.place;
        plan.noOfAttedance = noOfAttedance || plan.noOfAttedance;
        plan.venueName = venueName || plan.venueName;
        plan.brandName = brandName || plan.brandName;
        plan.hotelReqSendDate = hotelReqSendDate || plan.hotelReqSendDate;
        plan.paymentMode = paymentMode || plan.paymentMode;
        plan.advanceReqDate = advanceReqDate || plan.advanceReqDate;
        plan.ppmCost = ppmCost || plan.ppmCost;
        plan.ppmStatus = statusCheck !== undefined ? statusCheck : plan.ppmStatus;
        plan.ppmModifiedDate = `${day}-${month}-${year}`;

        // Save the updated FLM entity
        await flmExist.save();

        res.status(200).send({ message: "Plan updated successfully", success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to update plan", success: false });
    }
}

//Delete planned....
const deletePlan = async (req, res) => {
    try {
        const flmId = req.params.flmId;
        const planId = req.params.planId;

        //Check flm exist or not...
        const flmExist = await flmModel.findById(flmId);
        if (!flmExist) {
            return res.status(404).send({ message: "Flm not found..!!!", success: false });
        }

        // Check if the plan exists
        const planExist = flmExist.ppmPlanning.id(planId);
        if (!planExist) {
            return res.status(404).send({ message: "Plan not found..!!!", success: false });
        }

        // Remove the plan using pull method
        flmExist.ppmPlanning.pull(planId);

        // Save the updated FLM entity....
        await flmExist.save();

        res.status(200).send({ message: "Plan deleted successfully..", success: true });

    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to delete ppm plan..!!", success: false });
    }
}

//After certain date PPM plan moved from ppmPlanning -----> ppmState...
const planMigration = async () => {
    try {

        // Get current date in dd-mm-yyyy format
        const currentDate = moment().format('DD-MM-YYYY');

        // Get all plan...
        const flms = await flmModel.find();

        for (const flm of flms) {
            // Filter plans with the current date...
            const plansToMove = flm.ppmPlanning.filter(plan => plan.ppmDate === currentDate);

            if (plansToMove.length > 0) {

                // Move the plans to ppmState...
                flm.ppmState.push(...plansToMove);

                // Remove the plans from ppmPlanning....
                flm.ppmPlanning = flm.ppmPlanning.filter(plan => plan.ppmDate !== currentDate);

                // Save the updated FLM entity...
                await flm.save();

                console.log(`Moved ${plansToMove.length} plans for FLM ID ${flm._id}`);
            }
        }
    } catch (err) {
        console.error("Error moving plans:", err);
    }
};
// Schedule the job to run every 20 seconds
cron.schedule("*/20 * * * * *", planMigration);

//Update ppmState plan....
const updateStatePlan = async (req, res) => {
    try {
        const flmId = req.params.flmId;
        const planId = req.params.planId;
        const { ppmDate, speakerName, scCode, doctorSpec, place, noOfAttedance, venueName, brandName, hotelReqSendDate, paymentMode, advanceReqDate, ppmCost, ppmPlanStatus, ppmPlanScheduleDate, statusCheck } = req.body;

        // Check if FLM exists
        const flmExist = await flmModel.findById(flmId);
        if (!flmExist) {
            return res.status(404).send({ message: "FLM not found", success: false });
        }

        // Update ppmModifiedDate with current date in "dd-mm-yyyy" format....
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();


        // Find the plan to update
        let planIndex = -1;
        flmExist.ppmState.forEach((plan, index) => {
            if (plan._id.toString() === planId) {
                planIndex = index;
            }
        });

        if (planIndex === -1) {
            return res.status(404).send({ message: "Plan not found", success: false });
        }

        // Update the plan with the new data
        const planToUpdate = flmExist.ppmState[planIndex];
        planToUpdate.ppmDate = ppmDate || planToUpdate.ppmDate;
        planToUpdate.speakerName = speakerName || plan.speakerName;
        planToUpdate.scCode = scCode || planToUpdate.scCode;
        planToUpdate.doctorSpec = doctorSpec || planToUpdate.doctorSpec;
        planToUpdate.place = place || planToUpdate.place;
        planToUpdate.noOfAttedance = noOfAttedance || planToUpdate.noOfAttedance;
        planToUpdate.venueName = venueName || planToUpdate.venueName;
        planToUpdate.brandName = brandName || planToUpdate.brandName;
        planToUpdate.hotelReqSendDate = hotelReqSendDate || planToUpdate.hotelReqSendDate;
        planToUpdate.paymentMode = paymentMode || planToUpdate.paymentMode;
        planToUpdate.advanceReqDate = advanceReqDate || planToUpdate.advanceReqDate;
        planToUpdate.ppmCost = ppmCost || planToUpdate.ppmCost;
        planToUpdate.ppmPlanStatus = ppmPlanStatus || planToUpdate.ppmPlanStatus;
        planToUpdate.ppmStatus = statusCheck !== undefined ? statusCheck : planToUpdate.ppmStatus;
        planToUpdate.ppmModifiedDate = `${day}-${month}-${year}`;

        // Use markModified for nested objects or arrays
        flmExist.markModified('ppmState');

        //If ppmSheduled status is postponed push -----> ppmPlanning...
        if (ppmPlanStatus === 'Postponed') {
            const postponedPlan = { ...planToUpdate, ppmDate: ppmPlanScheduleDate };
            flmExist.ppmPlanning.push(postponedPlan);
        }

        // Save the updated FLM entity...
        await flmExist.save();

        res.status(200).send({ message: "State Plan updated successfully", success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to update State plan", success: false });
    }
}

//Get plan details(ppmPlanning)....
const planDetail = async (req, res) => {
    try {
        const flmId = req.params.flmId;

        //Check flm exist or not....
        const flmExist = await flmModel.findById(flmId);
        if (!flmExist) {
            return res.status(404).send({ message: "Flm not found..!!", success: false });
        }

        //Loop data to store....
        const planReportDetail = [];

        //Iterate plan detail....
        for (plan of flmExist.ppmPlanning) {
            const data = {
                PPMDATE: plan.ppmDate,
                PPMSPK: plan.speakerName,
                PPMSCODE: plan.scCode,
                PPMSPEC: plan.doctorSpec,
                PPMPLACE: plan.place,
                PPMATTEDANCE: plan.noOfAttedance,
                PPMVNAME: plan.venueName,
                PPMBNAME: plan.brandName,
                PPMHOTELREQDATE: plan.hotelReqSendDate,
                PPMPMODE: plan.paymentMode,
                PPMADVREQDATE: plan.advanceReqDate,
                PPMCOST: plan.ppmCost,
                PPMSTATUS: plan.ppmStatus ? 'submit' : 'saved',
                PPMPLANSTATUS: plan.ppmPlanStatus,
                PPMMDFDATE: plan.ppmModifiedDate,
            }
            planReportDetail.push(data);
        }

        res.status(201).json(planReportDetail);
    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to fetch plan details..!!!", success: false });
    }
}

//Create Feedback...
// const createFeedback = async (req, res) => {
//     try {
//         const flmId = req.params.id;
//         const { planMode, plannedDate, plannedSpkName, accPPMDate, accSpkName, scCode, doctorSpec, place, noOfAttedance, venueName, brandName, topic, highlight, totalExpenses, advanceReceive, addAmount, expensesWithoutBills, desc, billNo, billDate, amount } = req.body;

//         //Check flm exist or not...
//         const flmExist = await flmModel.findById(flmId);
//         if (!flmExist) {
//             return res.status(404).send({ message: "Flm not found..!!", success: false });
//         }

//         // Parse expenses with bills...
//         let expensesWithBills = [];
//         if (Array.isArray(req.files) && req.files.length > 0) {
//             expensesWithBills = req.files.filter(file => file.fieldname === 'expenseFiles').map((file, index) => ({
//                 desc: req.body[`desc_${index}`],
//                 billNo: req.body[`billNo_${index}`],
//                 billDate: req.body[`billDate_${index}`],
//                 amount: req.body[`amount_${index}`],
//                 expenseFile: file.path
//             }));
//         }

//         // Parse attendance list....
//         // const attedanceList = [];
//         // if (Array.isArray(req.body.attendance)) {
//         //     req.body.attendance.forEach((attendance, index) => {
//         //         attedanceList.push({
//         //             name: attendance[`name_${index}`],
//         //             scCode: attendance[`scCode_${index}`],
//         //             speciality: attendance[`speciality_${index}`]
//         //         });
//         //     });
//         // } else {
//         //     attedanceList.push({
//         //         name: req.body.attendance.name,
//         //         scCode: req.body.attendance.scCode,
//         //         speciality: req.body.attendance.speciality
//         //     });
//         // }

//         // Parse attendance list....
//         const attedanceList = [];
//         if (Array.isArray(req.body.attendance)) {
//             req.body.attendance.forEach((attendance, index) => {
//                 attedanceList.push({
//                     name: attendance[`name_${index}`],
//                     scCode: attendance[`scCode_${index}`],
//                     speciality: attendance[`speciality_${index}`]
//                 });
//             });
//         } else {
//             attedanceList.push({
//                 name: req.body.attendance.name,
//                 scCode: req.body.attendance.scCode,
//                 speciality: req.body.attendance.speciality
//             });
//         }

//         // Parse event photos....
//         // const eventPhotos = req.files.filter(file => file.fieldname === 'eventPhotos').map(file => ({
//         //     fileName: file.path
//         // }));

//         // Parse event photos
//         let eventPhotos = [];
//         if (req.files && Array.isArray(req.files)) {
//             eventPhotos = req.files.filter(file => file.fieldname === 'eventPhotos').map(file => ({
//                 fileName: file.path
//             }));
//         }


//         //Formated data of feedback....
//         const formatedData = {
//             planMode,
//             plannedDate,
//             plannedSpkName,
//             accPPMDate,
//             accSpkName,
//             scCode,
//             doctorSpec,
//             place,
//             noOfAttedance,
//             venueName,
//             brandName,
//             topic,
//             highlight,
//             totalExpenses,
//             advanceReceive,
//             addAmount,
//             expensesWithoutBills,
//             expensesWithBills,
//             attedanceList,
//             eventPhotos
//         }

//         flmExist.ppmFeedback.push(formatedData);
//         await flmExist.save();

//         res.status(201).send({ message: "New Feedback created successfully...", success: true });
//     } catch (err) {
//         console.log(err);
//         res.status(501).send({ message: "Failed to create new feedback..!!", success: false });
//     }
// }

const createFeedback = async (req, res) => {
    try {
        const flmId = req.params.id;
        const { planMode, plannedDate, plannedSpkName, accPPMDate, accSpkName, scCode, doctorSpec, place, noOfAttedance, venueName, brandName, topic, highlight, totalExpenses, advanceReceive, addAmount, expensesWithoutBills, desc, billNo, billDate, amount } = req.body;

        //Check flm exist or not...
        const flmExist = await flmModel.findById(flmId);
        if (!flmExist) {
            return res.status(404).send({ message: "Flm not found..!!", success: false });
        }

        // Parse event photos....
        const eventPhotos = req.files.filter(file => file.fieldname === 'eventPhotos').map(file => ({
            fileName: file.path
        }));



        //Formated data of feedback....
        const formatedData = {
            planMode,
            plannedDate,
            plannedSpkName,
            accPPMDate,
            accSpkName,
            scCode,
            doctorSpec,
            place,
            noOfAttedance,
            venueName,
            brandName,
            topic,
            highlight,
            totalExpenses,
            advanceReceive,
            addAmount,
            expensesWithoutBills,
            expensesWithBills,
            attedanceList,
            eventPhotos
        }

        flmExist.ppmFeedback.push(formatedData);
        await flmExist.save();

        res.status(201).send({ message: "New Feedback created successfully...", success: true });
    } catch (err) {
        console.log(err);
        res.status(501).send({ message: "Failed to create new feedback..!!", success: false });
    }
}




module.exports = {
    flmRegister,
    flmLogin,
    createPlan,
    updatePlan,
    deletePlan,
    updateStatePlan,
    planDetail,
    createFeedback
}