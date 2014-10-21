// Userlist data array for filling in info box
var questionList = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateQuestionArea();

});

// Functions =============================================================

// question class constructor
function Question(myQuestionText, myCorrectAnsw, answers){
	this.questionText = myQuestionText;
	this.correctAnsw = myCorrectAnsw;
	this.answers = answers;
}

//Add checkboxes dinamically
/*
function setLabelText(needle ,text){
	var labels = document.getElementsByTagName("label");
	var texts = [] ;
	for (var i = 0; i < labels.length; i++) {
		var label = labels[i];
		if(label.getAttribute("for") == needle) {
				label.innerHTML = text;
		}
	}
}

// update label text with answers
function setAnswer(answers_array){

	for (var k in answers_array) {
		alert(k.toString());
		var box = document.getElementById('test'+k.toString());	
		var labelText = setLabelText(box.id, answers_array[k-1]);
	}
}
*/

function setQuestionToPage(){
	
	var i = getRandomInt(0, questionList.length);	// get random question
	correctAnsw = questionList[i].correctAnsw;	//set correct Answer globally
	var questionPar = document.getElementById("question");	// set question to the questionParagrapher
	questionPar.innerHTML = questionList[i].questionText;
	var questionArea = document.getElementById("questionArea");
	
	
	//retrieve answers and add answers to the page
	var answersArea = document.getElementById("answersArea");
	//for each answer
	for (var j in questionList[i].answers) {
		var ans_id = JSON.stringify(questionList[i].answers[j]);	//retrieve answer id;		
		var queryURL = 'http://localhost:3000/answer/' + ans_id;	
		$.getJSON( queryURL, function( data ) {						//get answer object from server
		
			//dinamically add new checkbox related to that answer
			var row = document.createElement('div');
			row.className = "row";
			
			var checkbox = document.createElement('input');
			checkbox.type = "radio";
			checkbox.name = "answer";
			checkbox.value = data.answer.id;
			checkbox.id = data.answer.id;


			var label = document.createElement('label')
			label.htmlFor = data.answer.id;
			label.appendChild(document.createTextNode(data.answer.answer_text.toString()));
			
			row.appendChild(checkbox);
			row.appendChild(label);
			answersArea.appendChild(row);
			var br = document.createElement('br');
			answersArea.appendChild(br);

		});

	}
	
	
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
	max=max-1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fill table with data
function populateQuestionArea() {

    // Empty content string
    var tableContent = '';
    //var queryURL = 'http://localhost:3000/index/' + monster;
	//retrieve level from monster

	var queryURL1 = 'http://localhost:3000/monster/' + monster;
	
	// jQuery AJAX call for JSON
    $.getJSON(queryURL1, function( data ) {
        var monster_type = data.monster.type;
		var queryURL2 = 'http://localhost:3000/question?type='+monster_type;

		// jQuery AJAX call for JSON
		$.getJSON( queryURL2, function( data ) {
		
			// For each item in our JSON
			$.each(data.questions, function(){
				var question = new Question(this.question_text, this.correct_answer, this.answers);
				questionList.push(question);
			});
			
			setQuestionToPage();
		});
    });

    
};