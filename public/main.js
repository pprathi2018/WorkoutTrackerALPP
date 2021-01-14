
// const update = document.querySelector('#increase-weight');
document.getElementById("home").style.backgroundColor = "#D3D3D3";

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
var woExercisesDiv = document.getElementById("exContainer");
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

wspan.onclick = () => {
  wmodal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
/** 
window.onclick = function(event) {
  if (event.target == gmodal) {
    gmodal.style.display = "none";
  } else if (event.target == wmodal) {
    wmodal.style.display = "none";
  }
}
*/

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

    var btn = document.createElement("BUTTON");
    btn.type = "button";
    btn.className = "goal-collapsible";
    btn.name = inputVal;
    btn.innerHTML = inputVal;

    var collapsibleContent = document.createElement("div");
    collapsibleContent.className = "goal-collapsiblecontent";
    
    var input1 = document.createElement("input");
    input1.type = "text";
    input1.className = "modal-input";
    var input2 = document.createElement("input");
    input2.type = "text";
    input2.className = "modal-input";
    var input3 = document.createElement("input");
    input3.type = "text";
    input3.className = "modal-input";

    if (isLiftGoal) {
        input1.placeholder = "Start PR";
        input2.placeholder = "Current PR";
        input3.placeholder = "Desired PR";
    } else {
        input1.placeholder = "Start " + inputVal;
        input2.placeholder = "Current " + inputVal;
        input3.placeholder = "Desired " + inputVal;
    }

    // all names start with 7 letters
    input1.name = "startin" + inputVal;
    input2.name = "current" + inputVal;
    input3.name = "desired" + inputVal;

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
    deleteBtn.innerHTML = "Remove Goal";
    deleteBtn.type = "button";
    deleteBtn.id =  inputVal + "btn";
    deleteBtn.className = "deleteGoal-btn";
    deleteBtn.onclick = () => {
        var toDelete = document.getElementById(newGoal.id);
        toDelete.remove();
    }

    collapsibleContent.appendChild(input1);
    collapsibleContent.appendChild(input2);
    collapsibleContent.appendChild(input3);
    collapsibleContent.appendChild(deleteBtn);
    collapsibleContent.appendChild(hiddenInput);

    newGoal.appendChild(btn);
    newGoal.appendChild(collapsibleContent);
    // newGoal.appendChild(deleteBtn);

    divToAdd.appendChild(newGoal);

    btn.addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
          content.style.maxHeight = null;
      } else {
          content.style.maxHeight = content.scrollHeight + "px";
      }
  });
}

addExerciseBtn.onclick = () => {
  var inputVal = addExerciseInput.value;

  var newEx = document.createElement("div");
  newEx.id = inputVal + "div";

  var newLbl = document.createElement("label");
  newLbl.className = "modal-label";
  newLbl.innerHTML = inputVal;

  // var div = document.createElement("div");
  // div.className = "exercise-div";

  var input1 = document.createElement("input");
  input1.type = "text";
  input1.placeholder = "Sets";
  input1.name = "sets" + inputVal;
  input1.className = "modal-input";

  var input2 = document.createElement("input");
  input2.type = "text";
  input2.placeholder = "Reps";
  input2.name = "reps" + inputVal;
  input2.className = "modal-input";

  var input3 = document.createElement("input");
  input3.type = "text";
  input3.placeholder = "Weight";
  input3.name = "weight" + inputVal;
  input3.className = "modal-input";

  var deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "&times;";
  deleteBtn.type = "button";
  deleteBtn.id =  inputVal + "btn";
  deleteBtn.className = "deleteEx-btn";
  deleteBtn.onclick = () => {
      var toDelete = document.getElementById(newEx.id);
      toDelete.remove();
  }

  newEx.appendChild(newLbl);
  newEx.appendChild(input1);
  newEx.appendChild(input2);
  newEx.appendChild(input3);
  newEx.appendChild(deleteBtn);
  woExercisesDiv.appendChild(newEx);

  addExerciseInput.value = "";
}


/*****  STOPWATCH  *****/

var Stopwatch = function(elem, durElem, options) {

  var timer       = createTimer(),
      startButton = createButton("start", start),
      stopButton  = createButton("stop", stop),
      resetButton = createButton("reset", reset),
      offset,
      clock,
      interval;

  // default options
  options = options || {};
  options.delay = options.delay || 1;

  timer.className = "timer";
  startButton.className = "timer-btn";
  stopButton.className = "timer-btn";
  resetButton.className = "timer-btn";

  var div = document.createElement("div");
  div.className = "timer-div";
  // append elements     
  elem.appendChild(timer);
  div.appendChild(startButton);
  div.appendChild(stopButton);
  div.appendChild(resetButton);
  elem.appendChild(div);

  // initialize
  reset();

  // private functions
  function createTimer() {
    return document.createElement("span");
  }

  function createButton(action, handler) {
    var a = document.createElement("a");
    a.href = "#" + action;
    a.innerHTML = action;
    a.addEventListener("click", function(event) {
      handler();
      event.preventDefault();
    });
    return a;
  }

  function start() {
    if (!interval) {
      offset   = Date.now();
      interval = setInterval(update, options.delay);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    clock = 0;
    render();
  }

  function update() {
    clock += delta();
    render();
  }

  function render() {
    timer.innerHTML = clock/1000; 
    durElem.value = clock/1000;
  }

  function delta() {
    var now = Date.now(),
        d   = now - offset;

    offset = now;
    return d;
  }

  // public API
  this.start  = start;
  this.stop   = stop;
  this.reset  = reset;
};

var s = document.getElementById("stopwatch");
var d = document.getElementById("duration");
const sw = new Stopwatch(s, d, {delay: 10});

var workoutClearBtn = document.getElementById("clearWorkout")

workoutClearBtn.onclick = () => {
  while (woExercisesDiv.firstChild) {
    woExercisesDiv.removeChild(woExercisesDiv.firstChild);
  }
  sw.reset();
  sw.stop();
  addExerciseInput.value = "";
}

var deleteBtns = document.getElementsByClassName("deleteGoal-btn");
for (var i = 0; i < deleteBtns.length; i++) {
    const s = deleteBtns[i].id;
    deleteBtns[i].addEventListener('click', _ => {
        fetch('/deleteGoal', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: s.substring(0, s.length - 3)
            })
        })
        .then(res => {
            if (res.ok) return res.json();
        })
        .then(response => {
            window.location.reload();

            // if (response === "No Barbell Exercise to delete") {
            //     messageDiv.textContent = 'No Barbell Exercise to delete'
            // } else {
            //     window.location.reload();
            // }
        }).then(response => {
            gmodal.style.display = "block";
        })
        .catch(error => console.error(error))
    })
}