
//calls treasure hunts from API
//creates a list with all treasure hunts
function getTreasureHunts() {

    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            let playersName=prompt("Enter Your Name:", "");

            let thList = document.getElementById("thList");
            let treasureHunts = jsonObject.treasureHunts;

            for(let i=0; i < treasureHunts.length; i++) {

                let listItem = document.createElement("li");
                let treasureHuntName =  treasureHunts[i].name;
                let treasureHuntDesc =  treasureHunts[i].description;
                let treasureHuntID =  treasureHunts[i].uuid;

                //listItem.innerHTML ="<div class='container2'>" + "<h4>" +treasureHuntName+ "</h4>"+ "<p>" +treasureHuntDesc+ "</p>" + "<a href='https://codecyprus.org/th/api/start?player="+ playersName +"&app=team3TreasureHunt&treasure-hunt-id="+treasureHuntID+"'>Start</a>" + "</div><br>";
                listItem.innerHTML ="<div class='container2'>" + "<h4>" +treasureHuntName+ "</h4>"+ "<p>" +treasureHuntDesc+ "</p>" + "<a href='question.html?player="+ playersName +"&treasure-hunt-id="+treasureHuntID+"'>Start</a>" + "</div><br>";

                thList.appendChild(listItem);
            }
        });
}

//function that starts the th game
function getStartData() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const playersName = urlParams.get('player')
    let treasureHuntID = urlParams.get('treasure-hunt-id')

    console.log(playersName);
    console.log(treasureHuntID);

    //example link
    //https://codecyprus.org/th/api/start?player=Homer&app=simpsons-app&treasure-hunt-id=ag9nfmNvZGVjeXBydXNvcmdyGQsSDFRyZWFzdXJlSHVudBiAgICAvKGCCgw
    fetch("https://codecyprus.org/th/api/start?player="+ playersName +"&app=team3TreasureHunt&treasure-hunt-id="+treasureHuntID+"")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            let thstatus = jsonObject.status;
            let thsession = jsonObject.session;
            let totalQuestions = jsonObject.numOfQuestions;

            if(thstatus==="OK") {
                //gets questions from server and shows them to the user
                getQuestion(thsession);

            } else {
                document.write(jsonObject.errorMessages);
            }

            console.log(thsession);
            console.log(totalQuestions);

        });
}

//function that calls the questions from server
function getQuestion(thsession) {

    //example link
    //https://codecyprus.org/th/api/question?session=ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM
    fetch("https://codecyprus.org/th/api/question?session="+ thsession +"")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            //hides all answer elements
            questionButton = document.getElementsByClassName("questionButton");

            for (i = 0; i < questionButton.length; i++) {
                questionButton[i].style.display = "none";
            }

            //initializing properties from server
            let qStatus = jsonObject.status;
            let totalQuestions = jsonObject.numOfQuestions;

            //gets the number of current question
            let questionNo = jsonObject.currentQuestionIndex;

            //calculates the final question
            let finalQuestion = jsonObject.numOfQuestions;
            finalQuestion = finalQuestion - 1;

            //gets question from server
            let questionText = jsonObject.questionText;

            //gets what type is the question
            let questionType = jsonObject.questionType;
            console.log(questionType)

            //specifies if question can be skipped
            let isSkip = jsonObject.canBeSkipped;

            //specifies if the user has already completed this treasure hunt
            let isComplete = jsonObject.completed;

            //specifies if question requires location
            let isLocation = jsonObject.requiresLocation;

            //get element in html to print question
            let question = document.getElementById("question");

            //exports question to player
            question.innerHTML = questionText;

            //functionality of HTML elements
            //text elements
            let submitString = document.getElementById("submitString");
            let answerString = document.getElementById("answerString");

            //number elements
            let submitNo = document.getElementById("submitNo");
            let answerNo = document.getElementById("answerNo");


            //boolean elements
            let boolF = document.getElementById("boolF");
            let boolT = document.getElementById("boolT");

            //MCQ buttons
            let buttonA = document.getElementById("buttonA");
            let buttonB = document.getElementById("buttonB");
            let buttonC = document.getElementById("buttonC");
            let buttonD = document.getElementById("buttonD");

            //let locMessage = document.getElementById("locMessage");

            let answer;



            //checks what type each question is and acts accordingly
            if (questionType==="BOOLEAN") {
                //if answer requires location then get location every 30seconds
                if (isLocation===true) {
                    getLocation();
                    setInterval(getLocation, 30000);
                }

                //shows boolean submit buttons (changing css display to inline)
                boolT.style.display = "inline";
                boolF.style.display = "inline";


                //get answer (using onclick in js)
                boolT.onclick = function() { answer = true;
                                            sendAnswertoServer(thsession, answer);
                                            };

                //get answer (using onclick in js)
                boolF.onclick = function() { answer = false;
                                            sendAnswertoServer(thsession, answer);
                                            };

            }
            else if (questionType==="INTEGER") {
                //if answer requires location then get location every 30seconds
                if (isLocation===true) {
                    getLocation();
                    setInterval(getLocation, 30000);
                }

                //shows number input and submit button (changing css display to inline)
                answerNo.style.display = "inline";
                submitNo.style.display = "inline";

                //get answer (using onclick in js)
                submitNo.onclick = function() { answer = answerNo.value;
                                                sendAnswertoServer(thsession, answer);
                                                answerNo.value = '';
                                                };


            }
            else if (questionType==="NUMERIC") {
                //if answer requires location then get location every 30seconds
                if (isLocation===true) {
                    getLocation();
                    setInterval(getLocation, 30000);
                }

                //shows number input and submit button (changing css display to inline)
                answerNo.style.display = "inline";
                submitNo.style.display = "inline";
                answer = answerNo.value;

                //get answer (using onclick in js)
                submitNo.onclick = function() { answer = answerNo.value;
                                                sendAnswertoServer(thsession, answer);
                                                answerNo.value = '';
                                                };
            }
            else if (questionType==="MCQ") {
                //if answer requires location then get location every 30seconds
                if (isLocation===true) {
                    getLocation();
                    setInterval(getLocation, 30000);
                }

                //shows 4 boolean submit buttons (changing css display to inline)
                buttonA.style.display = "inline";
                buttonB.style.display = "inline";
                buttonC.style.display = "inline";
                buttonD.style.display = "inline";

                //get answer (using onclick in js)
                buttonA.onclick = function() {  answer = 'A';
                                                sendAnswertoServer(thsession, answer);
                                                };

                //get answer (using onclick in js)
                buttonB.onclick = function() {  answer = 'B';
                                                sendAnswertoServer(thsession, answer);
                                                };

                //get answer (using onclick in js)
                buttonC.onclick = function() {  answer = 'C';
                                                sendAnswertoServer(thsession, answer);
                                                };

                //get answer (using onclick in js)
                buttonD.onclick = function() {  answer = 'D';
                                                sendAnswertoServer(thsession, answer);
                                                };


            }
            else if (questionType==="TEXT") {
                //if answer requires location then get location every 30seconds
                if (isLocation===true) {
                    getLocation();
                    setInterval(getLocation, 30000);
                }

                //shows text input and submit button (changing css display to inline)
                answerString.style.display = "inline";
                submitString.style.display = "inline";

                //get answer (using onclick in js)
                submitString.onclick = function() { answer = answerString.value;
                                                    sendAnswertoServer(thsession, answer);
                                                    answerString.value = '';
                                                    };

            }



        });
}

function sendAnswertoServer(thsession, answer){

    //example link
    //https://codecyprus.org/th/api/answer?session=ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM&answer=42
    fetch("https://codecyprus.org/th/api/answer?session="+ thsession +"&answer="+ answer +"")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            console.log(answer);

            //initializing properties from server
            let ansStatus = jsonObject.status;

            //gets boolean if answer is correct
            let isCorrect = jsonObject.correct;
            console.log(isCorrect);

            //gets boolean if session has been completed
            let isComplete = jsonObject.completed;

            //gets message from server
            let message = jsonObject.message;

            let messageElement = document.getElementById("message");

            //shows message according to status (OK/ERROR)
            if (ansStatus==="OK") {
                messageElement.innerText = message;
                messageElement.style.display = "block";
                if (isCorrect===true) {
                    getQuestion(thsession);
                }
            }
            else if (ansStatus==="ERROR") {
                let errorMessages = jsonObject.errorMessages;

                for(let i=0; i < errorMessages.length; i++) {
                    messageElement.innerText = errorMessages[i];
                }
            }
        });
}

//function gets player location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPosition);
    }
    else {
        alert("Geolocation is not supported by your browser.");
    }
}

//function sends player's location to server
function sendPosition(position, thsession) {

    //alert("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    console.log(latitude);
    console.log(longitude);

    //example link
    //https://codecyprus.org/th/api/location?session=ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM&latitude=34.683646&longitude=33.055391
    fetch("https://codecyprus.org/th/api/question?session="+ thsession +"&latitude=" + latitude + "&longitude=" + longitude +"")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            //initializing properties from server
            let locStatus = jsonObject.status;


            //gets message from server
            let message = jsonObject.message;

            let locMessage = document.getElementById("locMessage");

            if (locStatus==="OK") {
                locMessage.innerText = message;
                locMessage.style.display = "block";
            }


        });
    }