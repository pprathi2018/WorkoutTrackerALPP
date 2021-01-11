// const { Router } = require("express");

// const update = document.querySelector('#increase-weight');
document.getElementById("home").style.backgroundColor = "#92C4EE";

// update.addEventListener('click', _ => {
//     fetch('/exercises', {
//         method: 'put',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//             name: 'Barbell Press',
//             weight: '90'
//         })
//     }).then(res => {
//         if (res.ok) return res.json();
//     }).then(response => {
//         window.location.reload();
//     }).catch(error => console.error(error))
// })

// const deleteButton = document.querySelector("#delete-exercise");
// const messageDiv = document.querySelector('#message');

// deleteButton.addEventListener('click', _ => {
//     fetch('/exercises', {
//         method: 'delete',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//             name: 'Barbell Press'
//         })
//     }).then(res => {
//         if (res.ok) return res.json();
//     }).then(response => {
//         if (response === "No Barbell Exercise to delete") {
//             messageDiv.textContent = 'No Barbell Exercise to delete'
//         } else {
//             window.location.reload();
//         }
//     }).catch(error => console.error(error))
// })

var gmodal = document.getElementById("goals-modal");
var gbtn = document.getElementById("goals-btn");
var gspan = document.getElementsByClassName("close")[1];
var genGoalsDiv = document.getElementById("goals-gen");
var genGoalsBtn = document.getElementById("addGenGoalBtn");
var genGoalsInput = document.getElementById("addGGInput");
var liftGoalsDiv = document.getElementById("goals-lift");
var liftGoalsBtn = document.getElementById("addLiftGoalBtn");
var liftGoalsInput = document.getElementById("addLiftGoalInput");

var wmodal = document.getElementById("workout-modal");
var wbtn = document.getElementById("startWorkout");
var wspan = document.getElementsByClassName("close")[0];
var addExerciseBtn = document.getElementById("addExerciseBtn");
var workoutDiv = document.getElementById("exercises");
var addExerciseInput = document.getElementById("addExercise");

// When the user clicks on the button, open the modal
gbtn.onclick = function() {
  gmodal.style.display = "block";
}

wbtn.onclick = function() {
  wmodal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
gspan.onclick = function() {
  gmodal.style.display = "none";
}

wspan.onClick = function() {
  wmodal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == gmodal) {
    gmodal.style.display = "none";
  } else if (event.target == wmodal) {
    wmodal.style.display = "none";
  }
}

// Adds a general goal
genGoalsBtn.onclick = () => {
    var inputValue = genGoalsInput.value;
    if (inputValue != "") {
      addGoal(genGoalsDiv, inputValue);
      genGoalsInput.value = "";
    }
}

// Adds a lift goal
liftGoalsBtn.onclick = () => {
    var inputValue = liftGoalsInput.value;
    if (inputValue != "") {
      addGoal(liftGoalsDiv, inputValue, true);
      liftGoalsInput.value = "";
    }
}

addGoal = (divToAdd, inputVal, isLiftGoal) => {
    var newGoal = document.createElement("div");
    newGoal.id = inputVal + "div";

    var newLbl = document.createElement("label");
    newLbl.className = "modal-label";
    newLbl.innerHTML = inputVal;
    
    var input1 = document.createElement("input");
    input1.type = "text";
    var input2 = document.createElement("input");
    input2.type = "text";

    if (isLiftGoal) {
        input1.placeholder = "Current PR";
        input2.placeholder = "Desired PR";
    } else {
        input1.placeholder = "Current " + inputVal;
        input2.placeholder = "Desired " + inputVal;
    }

    input1.name = "current" + inputVal;
    input2.name = "desired" +  inputVal;

    var hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";

    if (isLiftGoal) {
      hiddenInput.name = "hidden-" + inputVal;
      hiddenInput.value = "Lift";
    } else {
      hiddenInput.name = "hidden-" + inputVal;
      hiddenInput.value = "General";
    }

    var deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "&times;";
    deleteBtn.type = "button";
    deleteBtn.id =  inputVal + "btn";
    deleteBtn.onclick = () => {
        var toDelete = document.getElementById(newGoal.id);
        toDelete.remove();
    }

    newGoal.appendChild(newLbl);
    newGoal.appendChild(input1);
    newGoal.appendChild(input2);
    newGoal.appendChild(hiddenInput);
    newGoal.appendChild(deleteBtn);
    divToAdd.appendChild(newGoal);
}

addExerciseBtn.onclick = () => {
  var inputVal = addExerciseInput.value;

  var newEx = document.createElement("div");
  newEx.id = inputVal + "div";

  var newLbl = document.createElement("label");
  newLbl.className = "modal-label";
  newLbl.innerHTML = inputVal;

  var input1 = document.createElement("input");
  input1.type = "text";
  input1.placeholder = "Sets";
  input1.name = "sets" + inputVal;


  var input2 = document.createElement("input");
  input2.type = "text";
  input2.placeholder = "Reps";
  input2.name = "reps" + inputVal;

  var input3 = document.createElement("input");
  input3.type = "text";
  input3.placeholder = "Weight";
  input3.name = "weight" + inputVal;

  var deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "&times;";
  deleteBtn.type = "button";
  deleteBtn.id =  inputVal + "btn";
  deleteBtn.onclick = () => {
      var toDelete = document.getElementById(newEx.id);
      toDelete.remove();
  }

  newEx.appendChild(newLbl);
  newEx.appendChild(input1);
  newEx.appendChild(input2);
  newEx.appendChild(input3);
  newEx.appendChild(deleteBtn);
  workoutDiv.appendChild(newEx);
}