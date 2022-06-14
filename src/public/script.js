//var userId;


function selectCovid() {
    var information = document.getElementById("informationCovid");
    if (information.style.display === "none") {
        information.style.display = "block";
    } else {
        information.style.display = "none";
    }
}

function selectGripe() {
    var information = document.getElementById("informationGripe");
    if (information.style.display === "none") {
        information.style.display = "block";
    } else {
        information.style.display = "none";
    }
}

async function register1() {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var email = document.getElementById("email").value;
    var surname = document.getElementById("surname").value;
    var dni = document.getElementById("dni").value;
    var dateBirth = document.getElementById("dateBirth").value;
    var risk = document.getElementById("risk").value;
    var vaccination = document.getElementById("vaccination").value;
    var infoUser = {
        "name": name,
        "password": password,
        "email": email,
        "surname": surname,
        "dni": dni,
        "dateBirth": dateBirth,
        "risk": risk,
        "vaccination": vaccination
    }

    console.log(name, password, email, surname, dni, dateBirth, risk, vaccination);
    window.alert(`el DNI: ${dni} fue validado satisfactoriamente con el RENAPER`);
    var ok = await fetch("http://localhost:3000/users/patient/register", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(infoUser), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())

    console.log(ok);
    if (ok.success) {
        //------ info covid -------
        userId = ok.data.id;
        
        window.alert(`Tu doble factor es: ${ok.data.doubleFactor}`);
        var selectedCovid = document.getElementById("selectedCovid").value;
        if (selectedCovid == "true") {
            var amountVaccineCovid = document.getElementById("amountCovid").value;
            var lastVaccineCovid = document.getElementById("lastVaccineCovid").value;
            var infoCovid = { "type": "covid", "date": lastVaccineCovid, "vaccination": vaccination };
            for (var i = 0; i < amountVaccineCovid; i++) {
                let ok = await fetch(`http://localhost:3000/users/patient/assignVaccine/${userId}`, {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify(infoCovid), // data can be `string` or {object}!
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                console.log(ok);
            }

        }
        //------ info gripe ------
        var selectedGripe = document.getElementById("selectedGripe").value;
        if (selectedGripe == "true") {
            var lastVaccineGripe = document.getElementById("lastVaccineGripe").value;
            var infoGripe = { "type": "gripe", "date": lastVaccineGripe, "vaccination": vaccination };
            let ok = await fetch(`http://localhost:3000/users/patient/assignVaccine/${userId}`, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(infoGripe), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
            console.log(ok);
        }
        //------ info fiebre -----
        var selectedFiebre = document.getElementById("selectedFiebre").value;
        if (selectedFiebre == "true") {
            vaccineFiebre = { "type": "fiebre" };
            let ok = await fetch(`http://localhost:3000/users/patient/assignVaccine/${userId}`, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(vaccineFiebre), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
            console.log(ok);
        }
        var assignCovid = await fetch(`users/patient/assignTurnCovid/${userId}`, {
                method: 'POST'
            })
            .then(res => res.json);


        var assignGripe = await fetch(`users/patient/assignTurnGripe/${userId}`, {
                method: 'POST'
            })
            .then(res => res.json);



        window.location.href = "http://localhost:3000/login";
    } else {
        window.alert(ok.error);
        window.location.href = "http://localhost:3000/register";
    }

}

async function register2() {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var email = document.getElementById("email").value;
    var surname = document.getElementById("surname").value;
    var dni = document.getElementById("dni").value;
    var dateBirth = document.getElementById("dateBirth").value;
    var risk = document.getElementById("risk").value;
    console.log(risk);
    var vaccination = document.getElementById("vaccination").value;
    var infoUser = {
        "name": name,
        "password": password,
        "email": email,
        "surname": surname,
        "dni": dni,
        "dateBirth": dateBirth,
        "risk": risk,
        "vaccination": vaccination
    }

    console.log(name, password, email, surname, dni, dateBirth, risk, vaccination);
    window.alert(`el DNI: ${dni} fue validado satisfactoriamente con el RENAPER`);
    var ok = await fetch("http://localhost:3000/users/patient/register", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(infoUser), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())

    console.log(ok);
    if (ok.success) {
        //------ info covid -------
         userId = ok.data.id;
        
        window.alert(`Tu doble factor es: ${ok.data.doubleFactor}`);
        var selectedCovid = document.getElementById("selectedCovid").value;
        if (selectedCovid == "true") {
            var amountVaccineCovid = document.getElementById("amountCovid").value;
            var lastVaccineCovid = document.getElementById("lastVaccineCovid").value;
            var infoCovid = { "type": "covid", "date": lastVaccineCovid , "vaccination": vaccination};
            for (var i = 0; i < amountVaccineCovid; i++) {
                let ok = await fetch(`http://localhost:3000/users/patient/assignVaccine/${userId}`, {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify(infoCovid), // data can be `string` or {object}!
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                console.log(ok);
            }

        }
        //------ info gripe ------
        var selectedGripe = document.getElementById("selectedGripe").value;
        if (selectedGripe == "true") {
            var lastVaccineGripe = document.getElementById("lastVaccineGripe").value;
            var infoGripe = { "type": "gripe", "date": lastVaccineGripe, "vaccination": vaccination };
            let ok = await fetch(`http://localhost:3000/users/patient/assignVaccine/${userId}`, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(infoGripe), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
            console.log(ok);
        }
        //------ info fiebre -----
        var selectedFiebre = document.getElementById("selectedFiebre").value;
        if (selectedFiebre == "true") {
            vaccineFiebre = { "type": "fiebre" };
            let ok = await fetch(`http://localhost:3000/users/patient/assignVaccine/${userId}`, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(vaccineFiebre), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
            console.log(ok);
        }


        window.location.href = "http://localhost:3000/users/vacunador/homeVacunador";
    } else {
        window.alert(ok.error);
        window.location.href = "http://localhost:3000/users/vacunador/homeVacunador";
    }

}

//----------scripts login------------------


async function loginUser() {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var doubleFactor = document.getElementById("doubleFactor").value;
    var data = { "email": email, "password": password, "doubleFactor": doubleFactor };
    let ok = await fetch(`http://localhost:3000/users/patient/login`, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())

}


//-----------script User Registed------------
async function assignFiebre() {
    var ok = await fetch('/users/patient/assignTurnFiebre')
        .then(data => {
            return data.json();
        })
    if (ok.success) {
        document.getElementById("p1").style.visibility = "hidden";
        document.getElementById("p2").style.visibility = "visible";
        document.getElementById("buttonSend").style.visibility = "hidden";

    }
    window.alert(ok.data);
}
async function changeCenter() {
    var select = document.getElementsByName("select");

    console.log(select[0].value);
    var data = { "data": select[0].value }
    let ok = await fetch(`http://localhost:3000/users/patient/changeCenter`, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json);
    var text = document.getElementById("p1");
    text.innerHTML = `Tu centro actual es ${select[0].value}`
    window.alert("Center modified successfully");
}

async function searchUsers() {
    var vaccine = document.getElementById("selectedVaccine").value;
    var data = {"data":vaccine}
    let ok = await fetch(`http://localhost:3000/users/vacunador/searchUsers`, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json());
    var list = document.getElementById("list");

    if(list.children.length!=0){
        list.innerHTML = '';
    }
    if(ok.data.length!=0){
        for (var i = 0; i < (ok.data.length); i++) {
            let element = document.createElement("li");
            element.id = `element${i}`
            let name = document.createElement("p");
            name.id=`name${i}`
            let nameAux = document.createTextNode(`${ok.data[i].email}`);
            name.appendChild(nameAux);
            let select = document.createElement("select");
            select.id=`select${i}`
            let optionYes = document.createElement("option");
            optionYes.value=true;
            let optionYesAux = document.createTextNode("asistio");
            optionYes.appendChild(optionYesAux);
            let optionNo = document.createElement("option");
            optionNo.value=false;
            let optionNoAux = document.createTextNode("no asistio");
            optionNo.appendChild(optionNoAux);
            select.appendChild(optionYes);
            select.appendChild(optionNo);
            element.appendChild(name);
            element.appendChild(select);
            list.appendChild(element);
            
    
        }

    }
}

async function sendAsist(){
    var list = document.getElementById("list");
    console.log(list.children.length);
    if(list.children.length!=0){
        for (var i = 0; i < (list.children.length); i++){
            let select = document.getElementById(`select${i}`);
            
                let name = document.getElementById(`name${i}`).innerHTML;
                console.log(name);
                let type = document.getElementById("selectedVaccine").value;
                console.log(type)
                let asist = document.getElementById(`select${i}`).value;
                console.log(asist)
                if(asist =="true"){
                    asist = true;
                }else{
                    asist = false;
                }
                let data = {"type":type,"email":name,"asist":asist};
                let ok = await fetch(`http://localhost:3000/users/vacunador/updateTurn`, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(data), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json());
                
                
            

            
            
            
        }
        window.alert("turnos actualizados correctamente")
        await searchUsers()
    }
}

async function darVacuna(bot){
    var date = new Date();
    
    console.log(bot);
    var data = {"type": bot.id, "date":date}
    var email = document.getElementById("email").innerHTML;
    let ok = await fetch(`http://localhost:3000/users/vacunador/assignVaccine/${email}`, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json());
    window.location.href = "http://localhost:3000/users/vacunador/assignVaccineVacunador";
}
