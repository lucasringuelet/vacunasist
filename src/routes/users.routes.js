const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Vaccine = require("../models/vaccine");
const Turn = require("../models/turn");



//login
router.post("/login", async(req, res) => {
    const userExist = await User.find({ email: `${req.body.email}` });

    console.log(userExist);
    if (userExist.length == 1) {
        if (userExist[0].password == req.body.password) {
            if (userExist[0].doubleFactor == req.body.doubleFactor) {
                req.session.userId = userExist[0]._id;
                //sesion    
                res.redirect('../../user');

            } else {
                res.json({ success: false, error: "user double factor incorrect" });
            }
        } else {
            res.json({ success: false, error: "user password incorrect" });
        }
    } else {
        res.json({ success: false, error: "user not exist" });
    }

})


//register
router.post("/register", async(req, res) => {
    const userExist = await User.find({ email: `${req.body.email}` }); //veo que el usuario no exista
    if (!userExist.length) {

        var doubleFactor = Math.floor(Math.random() * (200 - 1)) + 1;
        const { name, surname, dni, dateBirth, risk, password, email, vaccination } = req.body; //completar
        //const vaccine = new Vaccine({ type, date }); //completar
        //const newVaccine = await vaccine.save();

        const user = new User({
            name,
            password,
            email,
            doubleFactor,
            surname,
            dni,
            dateBirth,
            risk,
            vaccination
        });
        const newUser = await user.save();

        const data = { "id": newUser._id, "doubleFactor": doubleFactor };

        res.json({ success: true, data: data });
    } else {
        res.json({ success: false, error: "user exist" });
    }
});

//modificar centro de vacunacion
router.post("/updateVaccination/:id", async(req, res) => {
    const { vaccination } = req.body;
    await User.findByIdAndUpdate(req.params.id, vaccination);
    res.json({ success: true, data: "vaccination updated" });

})

//asignar vacunas a un paciente
router.post("/assignVaccine/:id", async(req, res) => {
    const { type, date } = req.body;

    const vaccine = new Vaccine({ type, date });
    const newVaccine = await vaccine.save();

    const userSearch = await User.find({ _id: `${req.params.id}` })
    userSearch[0].vaccinations.push(newVaccine._id);
    const userupdated = await userSearch[0].save();
    res.json({ success: true, data: 'the vaccine was assigned' });
})

//asignar turno covid(primero se cargaria la parte de las vacunas que tiene, 
//luego una vez ejecutado el assignVaccine para todas las vacunas que tiene, 
//ejecutariamos este assignTurn que verificaria si hay que asignarle o no turno de en este caso covid).
router.post("/assignTurnCovid/:id", async(req, res) => {
    const vaccine = "covid";
    const userSearch = await User.find({ _id: `${req.params.id}` })
    const user = userSearch[0];
    var today = new Date();
    var year = today.getFullYear();
    var dateBirthUser = new Date(user.dateBirth);
    var age = (year - dateBirthUser.getFullYear());
    //milisegundos de 1 semana
    const week = 604800000;


    var arrayVaccination = await Vaccine.find({ _id: user.vaccinations });
    var amountVaccine = (arrayVaccination.filter(element => element.type === "covid").length);
    if (amountVaccine >= 2) {
        res.json({ success: false, error: "user have 2 vaccine of covid" });
    } else {
        if (age < 18) {
            res.json({ success: false, error: "user smaller than 18" });
        } else {
            if (age > 60 || user.risk) {
                var date = new Date((today.getTime() + week));
                var userId = user._id;
                var state = true;
                const turn = new Turn({ userId, vaccine, date, state });
                await turn.save();
                res.json({ success: true, data: date });
            } else {
                var state = false;
                var userId = req.params.id;
                const turn = new Turn({ userId, vaccine, state });
                await turn.save();
                res.json({ success: true, data: "turn pennding to assinament" });
            }
        }
    }



})

//asignar turno gripe 
router.post("/assignTurnGripe/:id", async(req, res) => {
    const vaccine = "gripe";
    const userSearch = await User.find({ _id: `${req.params.id}` })
    const user = userSearch[0];
    var today = new Date();
    var year = today.getFullYear();
    var dateBirthUser = new Date(user.dateBirth);
    var age = (year - dateBirthUser.getFullYear());
    //milisegundos de 1 mes
    const month = 2629750000;


    var arrayVaccination = await Vaccine.find({ _id: user.vaccinations });
    var gripeVaccine = (arrayVaccination.filter(element => element.type === "gripe" && element.date != undefined));
    var arrayDateOfVaccines = gripeVaccine.map((element) => element.date);
    var dateMax = new Date(Math.max.apply(null, arrayDateOfVaccines));

    var diff = today.getTime() - dateMax.getTime();
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    console.log(days)

    if (days < 365) {
        res.json({ success: false, error: "not a year passed" });
    } else {
        if (age < 60) {
            var date = new Date((today.getTime() + (month * 6)));
            var userId = user._id;
            var state = true;
            const turn = new Turn({ userId, vaccine, date, state });
            await turn.save();
            res.json({ success: true, data: date });
        } else {
            if (age >= 60) {
                var date = new Date((today.getTime() + (month * 3)));
                var userId = user._id;
                var state = true;
                const turn = new Turn({ userId, vaccine, date, state });
                await turn.save();
                res.json({ success: true, data: date });
            }
        }
    }



})

router.post("/assignTurnFiebre/:id", async(req, res) => {
    const vaccine = "fiebre";
    const userSearch = await User.find({ _id: `${req.params.id}` })
    const user = userSearch[0];
    var today = new Date();
    var year = today.getFullYear();
    var dateBirthUser = new Date(user.dateBirth);
    var age = (year - dateBirthUser.getFullYear());


    var arrayVaccination = await Vaccine.find({ _id: user.vaccinations });
    var amountVaccine = (arrayVaccination.filter(element => element.type === "fiebre").length);
    if (amountVaccine > 0) {
        res.json({ success: false, error: "user have 1 vaccine of fiebre" });
    } else {
        if (age < 60) {

            res.json({ success: false, error: "user can't get vaccinated beacuse is minor than 60" });
        } else {
            var state = false;
            var userId = req.params.id;
            const turn = new Turn({ userId, vaccine, state });
            await turn.save();
            res.json({ success: true, data: "turn pennding to assinament" });
        }
    }



})

//vacunas dadas
router.get("/vaccines/:id", async(req, res) => {
    const user = await User.find({ _id: req.params.id });
    const vaccines = await Vaccine.find({ _id: user[0].vaccinations })
    res.json(vaccines);
});

//turnos del usuario
router.get("/turn/:id", async(req, res) => {
    const user = await User.find({ _id: req.params.id });
    const turns = await Turn.find({ userId: user[0]._id })
    res.json({ success: true, data: turns });
})


module.exports = router;