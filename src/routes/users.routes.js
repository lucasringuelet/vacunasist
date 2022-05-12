const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Vaccine = require("../models/vaccine");
const Turn = require("../models/turn");




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



        res.json({ success: true, data: doubleFactor });
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

//asignar turno covid
router.get("/assignTurnCovid/:id", async(req, res) => {
    const vaccine = req.body.type;
    const userSearch = await User.find({ _id: `${req.params.id}` })
    const user = userSearch[0];
    var today = new Date();
    var year = today.getFullYear();
    var dateBirthUser = new Date(user.dateBirth);
    var age = (year - dateBirthUser.getFullYear());
    //milisegundos de 1 semana
    const week = 604800000;

    if (vaccine === "covid") {
        if (age < 18) {
            res.json({ success: false, error: "user smaller than 18" });
        } else {
            if (age > 60 || user.risk) {
                var dateAux = new Date((today.getTime + week));
                var date = `${dateAux.getFullYear},${dateAux.getMonth},${dateAux.getDay}`
                var userId = user._id;
                var state = true;
                const turn = new Turn({ userId, vaccine, date, state });
                await turn.save();
                res.json({ success: true, data: date });
            } else {
                var state = false;
                const turn = new Turn({ userId, vaccine, state });
                await turn.save();
                res.json({ success: true, data: "turn pennding to assinament" });
            }
        }
    }

})

//vacunas dadas
router.get("/vaccines/:id", async(req, res) => {
    const user = await User.find({ _id: req.params.id });
    const vaccines = await Vaccine.find({ _id: user[0].vaccinations })
    res.json(vaccines);
});


module.exports = router;