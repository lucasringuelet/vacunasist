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

    console.log(name, password, email, surname, dni, dateBirth, risk, vaccination)

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
            var infoCovid = { "type": "covid", "date": lastVaccineCovid };
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
            var infoGripe = { "type": "gripe", "date": lastVaccineGripe };
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