const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Vaccine = require("../models/vaccine");
const Turn = require("../models/turn");
const session = require("express-session");


// Authentication and Authorization Middleware
var auth = function(req, res, next) {
    if (req.session && req.session.userId)
        return next();
    else
        return res.sendStatus(401);
};

//login
router.post("/loginVacunador", async(req, res) => {
    const userExist = await User.find({ email: `${req.body.email}` });

    console.log(userExist);
    if (userExist.length == 1) {
        if (userExist[0].password == req.body.password) {

            req.session.userId = userExist[0]._id;

            res.redirect('/users/vacunador/homeVacunador');

            
        } else {
            res.json({ success: false, error: "user password incorrect" });
        }
    } else {
        res.json({ success: false, error: "user not exist" });
    }

})



router.get("/homeVacunador",auth, (req,res) =>{
    res.render('homeVacunador');
})

//ver los pacientes por vacuna en el dia 

router.get("/pacientesVacunador",auth, (req,res) =>{
    res.render('pacientesVacunador');
})



router.get("/assignVaccineVacunador",auth, (req,res)=>{

    res.render('assignVaccineVacunador');
})

router.post("/assignVaccineVacunador",auth, (req,res)=>{

    var email = req.body.email;
    res.redirect(`/users/vacunador/darVacunasVacunador/${email}`);
})
router.get("/darVacunasVacunador/:email", auth,async (req,res) =>{
    var email = req.params.email;
    var aux2 = [];
    var userAux = await User.find({email:email});
    const vaccines = await Vaccine.find({ _id: userAux[0].vaccinations })
    console.log("vacunas",vaccines);
    var today = new Date();
    var year = today.getFullYear();
    var dateBirthUser = new Date(userAux[0].dateBirth);
    var age = (year - dateBirthUser.getFullYear());
    if(age>18){
        var covid = vaccines.filter(element => element.type =="covid");
        if(covid.length < 2 ){
            aux2.push("covid");
        }
    }
    var gripe = vaccines.filter(element => element.type =="gripe");
    if(gripe.length<1){
        aux2.push("gripe");
    }
    if(age<60){
        var fiebre = vaccines.filter(element => element.type =="fiebre");
        if(fiebre.length<1){
            aux2.push("fiebre");
        }
    }

    var aux = aux2.map(item => {
        const container = {};
        container["type"] = item;
        return container
    })
    console.log(aux)
    res.render('darVacunasVacunador',{email,aux})
})

//buscar pacientes del vacunador
router.post("/searchUsers",auth, async(req,res) =>{
    console.log(req.body.data);
    var today = new Date("2022-06-14T03:00:00.000+00:00");//modificar para la DEMO 
    var userAux = await User.find({_id: req.session.userId});
    var vaccination = userAux[0].vaccination
    
    var usersAux = await Turn.find({ vaccine: req.body.data, date: today, vaccination: vaccination })
    var users = [];
    for (var i = 0; i < usersAux.length; i++) {
        let searchUser = await User.find({_id:usersAux[i].userId});
        users.push(searchUser[0]);
    }
    
    console.log(users)
    res.json({ success: true, data: users });
})

router.post("/updateTurn",auth,async(req,res)=>{
    const { type, email, asist} = req.body;
    console.log(req.body);
    if(asist == "true"){
        var date = new Date("2022-06-14T03:00:00.000+00:00");//modificar para la DEMO

        const vaccine = new Vaccine({ type, date });
        const newVaccine = await vaccine.save();
    
        const userSearch = await User.find({email:email})
        userSearch[0].vaccinations.push(newVaccine._id);
        const userupdated = await userSearch[0].save();
        
        await Turn.deleteOne({"userId":userSearch[0]._id,"vaccine":type,"date":date});
        res.json({ success: true, data: 'the vaccine was assigned' });
    }else{
        const userSearch = await User.find({email:email})
        var date = new Date("2022-06-14T03:00:00.000+00:00");//modificar para la DEMO
        await Turn.deleteOne({"userId":userSearch[0]._id,"vaccine":type,"date":date});
        res.json({ success: true, data: 'the vaccine was assigned' }); 
    }

})

//asignar vacunas a un paciente
router.post("/assignVaccine/:email", async(req, res) => {
    const { type, date} = req.body;

    var userAux = await User.find({_id : req.session.userId} ) ;
    var vaccination = userAux[0].vaccination;
    const vaccine = new Vaccine({ type, date, vaccination });
    const newVaccine = await vaccine.save();
    console.log(req.params.email);
    const userSearch = await User.find({ email: `${req.params.email}` })
    console.log(userSearch[0]);
    userSearch[0].vaccinations.push(newVaccine._id);
    const userupdated = await userSearch[0].save();
    res.json({ success: true, data: 'the vaccine was assigned' });
})

module.exports = router;