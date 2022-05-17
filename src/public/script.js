
function selectCovid(){
    var information = document.getElementById("informationCovid");
    if(information.style.display === "none"){
        information.style.display = "block";
    }else{
        information.style.display = "none";
    }
}
function register1() {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var email = document.getElementById("email").value;
    var surname = document.getElementById("surname").value;
    var dni = document.getElementById("dni").value;
    var dateBirth = document.getElementById("dateBirth").value;
    var risk = document.getElementById("risk").value;
    var vaccination = document.getElementById("vaccination").value;
    console.log(name,password,email,surname,dni,dateBirth,risk,vaccination)
    var selectCovid = document.getElementById("select");
    if (selectCovid === true){
        var amountVaccineCovid = document.getElementById("amountCovid");
        var lastVaccineCovid = document.getElementById("lastVaccineCovid");
        
    }
    
}
