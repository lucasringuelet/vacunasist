const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Vaccine = require("../models/vaccine");

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

//register
router.post("/", async (req, res) => {
  const userExist = await User.find({ email: `${req.body.email}` });
  if (!userExist.length) {
      
    var doubleFactor = Math.floor(Math.random() * (200 - 1)) + 1;
    console.log(doubleFactor);
    const { name, password, email, type } = req.body; //completar
    const vaccine = new Vaccine({ type }); //completar
    const newVaccine = await vaccine.save();

    const user = new User({
      name,
      password,
      email,
      doubleFactor,
      vaccinations: [newVaccine._id],
    });
    const newUser = await user.save();
    

    var data = { doubleFactor: `${doubleFactor}` };
    res.json({ success: true, data:data});
  } else {
    res.json({ success: false, error:"user exist"});
  }
});

module.exports = router;
