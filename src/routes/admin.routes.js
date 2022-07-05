const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Vaccine = require("../models/vaccine");
const Turn = require("../models/turn");
const session = require("express-session");
const Vaccination = require("../models/vaccination");

// Authentication and Authorization Middleware
var auth = function (req, res, next) {
    if (req.session && req.session.userId)
        return next();
    else
        return res.sendStatus(401);
};

//login
router.post("/loginAdmin", async (req, res) => {
    const userExist = await User.find({ email: `${req.body.email}` });

    console.log(userExist);
    if (userExist.length == 1) {
        if (userExist[0].password == req.body.password) {

            req.session.userId = userExist[0]._id;

            res.redirect('/users/admin/homeAdmin');


        } else {
            res.json({ success: false, error: "user password incorrect" });
        }
    } else {
        res.json({ success: false, error: "user not exist" });
    }

})



router.get("/homeAdmin", auth, (req, res) => {
    res.render('homeAdmin');
})



router.post('/modificar-cliente', async (req, res) => {
    console.log(req.body);
    console.log(req.session.vaccine);
    try {
        const users = await User.find({ email: { $in: req.body.email } });
        const userIds = users.map(user => (user._id));
        const response = await Turn.updateMany({ userId: { $in: userIds }, vaccine: req.session.vaccine }, {
            $set: {

                "date": req.body.date,
                "state": true
            }
        })
        res.send({ "users": response })
    } catch (error) {
        console.log(error)
        res.send(error)
    }

})

router.get('/searchUserDate', async (req, res) => {
    try {

        req.session.vaccine = req.query.vacuna;
        const turns = await Turn.find({ $and: [{ vaccine: req.query.vacuna }, { state: false }] });
        const turnIds = turns.map(turn => (turn.userId));
        const users = await User.find({ _id: { $in: turnIds } }, { email: 1 });
        const userEmail = users.map(user => (user.email));
        console.log(users[0]);

        res.render('homeAdmin', { users: userEmail });
    } catch (error) {
        res.send(error);
    }
})



router.get("/infoAdminVaccine", auth, (req, res) => {
    res.render('infoAdminVaccine');
})

router.get("/searchPatientForDate", auth, async (req, res) => {

    const vaccines = await Vaccine.find({ $and: [{ type: req.query.vacuna }, { date: req.query.date }] });
    const vaccineIds = vaccines.map(vaccine => (vaccine._id));
    const users = await User.find({ vaccinations: { $in: vaccineIds } });
    const info = users.map(user => (user.email));//SE PUEDE AGREGAR MAS INFO (VER COMO)
    console.log(info)
    if (info.length > 0) {
        res.render('infoAdminVaccine', { info });
    } else {
        res.render('infoAdminVaccine', { noInfo: "No se encontro informacion" });
    }

})

router.get("/searchPatientForEmail", auth, async (req, res) => {

    const vaccines = await Vaccine.find({ type: req.query.vacuna });
    const vaccineIds = vaccines.map(vaccine => (vaccine._id));
    const users = await User.find({ vaccinations: { $in: vaccineIds } }).lean();
    const info2 = users.find(user => user.email == req.query.email);
    console.log(info2)
    if (info2) {
        res.render('infoAdminVaccine', { info2 });
    } else {
        res.render('infoAdminVaccine', { noInfo: "No se encontro informacion" });
    }

})

router.get("/infoPatient", auth, (req, res) => {
    res.render('infoPatient');
})

router.get("/searchPatientForVaccination", auth, async (req, res) => {
    const users = await User.find({ vaccination: req.query.vaccination }).lean();
    const info = users.map(user => user.email);
    console.log(info);
    if (info.length > 0) {
        res.render('infoPatient', { info });
    } else {
        res.render('infoPatient', { noInfo: "No se encontro informacion" });
    }
})

router.get("/searchPatientForEmailCase2", auth, async (req, res) => {
    const user = await User.find({ email: req.query.email }).lean();
    const info2 = user[0];
    console.log(info2);

    if (info2) {
        res.render('infoPatient', { info2 });
    } else {
        res.render('infoPatient', { noInfo: "No se encontro informacion" });
    }
})

router.get("/modifyDataCenterAdmin", auth, (req, res) => {
    res.render('modifyDataCenterAdmin');
})

router.get("/searchCenter", auth, async (req, res) => {
    console.log(req.query.vaccination);
    const vaccination = await Vaccination.find({ name: req.query.vaccination }).lean();
    console.log(vaccination);
    const info = vaccination[0];
    req.session.center = info.name;
    res.render('modifyDataCenterAdmin', { info });
})

router.get("/modifyDataCenter", auth, async (req, res) => {
    console.log(req.query.adress);
    const response = await Vaccination.updateOne({ name: req.session.center }, {
        $set: {

            "adress": req.query.adress
        }
    })
    res.render('modifyDataCenterAdmin');
})

module.exports = router;