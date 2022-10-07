
import final from "./finalResults.js";
import settings from "./settings.js";
class Quiz {
    constructor (quizArea,result,amount){
        //get elements
        this.quizCanvas = document.querySelector(".quiz-canvas");
        this.bulletContainer = document.querySelector(".bullet-container");
        this.submit = document.querySelector("#submit-btn")
        this.quizQNum = document.querySelector(".quiz-stats .quiz-Q-num")
        this.quizTime = document.querySelector(".quiz-stats .quiz-time")
        this.interval;
        //general settings
        this.current = 0;
        this.N_Of_correct_Answers = 0;
        this.interval;
        //get data from API
        this.Qcount = amount;
        this.Only_One_Q = result[this.current];
        this.Correct = result[this.current].correct_answer;
        this.allAnswers = [this.Correct , ...result[this.current].incorrect_answers];

        //call function to show data
        this.showQuestion(this.Only_One_Q , this.allAnswers ,this.current);
        //run timer function for the first Q
        this.timer(4,amount,this.current);
        //call function to create bullets
        this.createBullets(amount);

        //import function from settings
        this.handleActive = new settings();
        this.handleActive.handleActive();
        //on submit run nextQuestion function 
        this.submit.addEventListener("click" ,() => {
            //check answer before incrementing
            let currentQ = result[this.current];
            let currentCorrect = result[this.current].correct_answer ;
            let allAnswers = [result[this.current].correct_answer , ...result[this.current].incorrect_answers];
            let currentIndex = this.current;
            this.checkAnswer(currentCorrect, currentQ, allAnswers,currentIndex);
            //incfement current index
            this.current += 1;

            //clear interval and call function to set timer
            clearInterval(this.interval);
            this.timer(4 , amount, this.current);

            //function to handle span
            this.handleSpan(this.current);
            //clear quiz v=canvas
            this.quizCanvas.innerHTML = "";
            //call show function to create a new question
            if(this.current < amount){
                let currentQ = result[this.current];
                let currentCorrect = result[this.current].correct_answer ;
                let allAnswers = [result[this.current].correct_answer , ...result[this.current].incorrect_answers];
                let currentIndex = this.current;
                console.log(currentQ , allAnswers , currentIndex)
                this.showQuestion(currentQ,allAnswers,currentIndex);
                //handle active classes on input fields
                this.handleActive.handleActive();
            }else{
                new final(quizArea,this.N_Of_correct_Answers,amount);
            }
        });
    }

    showQuestion = (Object , answers ,currentIndex) => {
        if(currentIndex < this.Qcount){
            //add the question to the h3 element in teh quiz area
            let h3 = document.createElement("h3");
            //function to decode the html entities from the question
            function unescapeHtml(question) {
                return question.replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'");
            }

            let decodedQ = unescapeHtml(Object.question);

            let h3TextNode = document.createTextNode(`[${currentIndex + 1}] ${decodedQ}`);
            h3.appendChild(h3TextNode);
            this.quizCanvas.appendChild(h3);
    
            let AnswersContent = document.createElement("div");
            AnswersContent.className = "Answers-content";

            //function to randomaize the answers
            function randomItemWithNoRepetition(answers){
                return function() {
                    if (answers.length < 1) { answers = Array.from(answers); } // This line exist to create copy and make a new array from actual array whenever all possible options are selected once
                    let index = Math.floor(Math.random() * answers.length); // Select an index randomly
                    let item = answers[index]; // Get the index value
                    answers.splice(index, 1); // Remove selected element from copied array
                    
                    //function to decode the html entities
                    function unescapeHtml(item) {
                        return item.replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .replace(/&#039;/g, "'");
                    }
                    return unescapeHtml(item); // Return selected element

                };
            }

            let choosed = randomItemWithNoRepetition(answers);

    
            for(let i=0; i<4; i++){
                let inputField = document.createElement("div");
                inputField.className = "input-field";
    
                let input = document.createElement("input");
                input.name = "Answer";
                input.id = `A-${i}`;
                input.type = "radio";
    
                let label = document.createElement("label");
                let labelTextNode = document.createTextNode(`${choosed()}`);
                label.appendChild(labelTextNode);
                label.htmlFor = `A-${i}`;
    
                inputField.appendChild(input);
                inputField.appendChild(label);
    
                AnswersContent.appendChild(inputField);
                this.quizCanvas.appendChild(AnswersContent);
            }

            this.quizQNum.innerHTML = `
                ${currentIndex + 1} from ${this.Qcount}
            `
        }
    }

    //function to create bullets
    createBullets = (count) => {
        for (let i=1; i<=count;i++){
            let span = document.createElement("span");
            if(i == 1){
                span.classList.add("done");
            }

            this.bulletContainer.appendChild(span);
        }
    }

    //function to check answer
    checkAnswer = (correct , Object , answers ,currentIndex) => {
        let checkedInput = Array.from(document.getElementsByName("Answer"));
        checkedInput = checkedInput.filter((input) => input.checked);
        if(checkedInput.length > 0){
            let checkedLabel = checkedInput[0].nextElementSibling.innerHTML;
            if(checkedLabel == correct){
                this.N_Of_correct_Answers += 1;
            }
        }
    }

    //function to handle span
    handleSpan = (currentIndex) => {
    let spans = Array.from(document.querySelectorAll(".bullet-container span"));
    spans.forEach((span , index) => {
        if(index == currentIndex){
            span.className = "done";
        }
    })
    }

    //count down timer
    timer = (duration , count, currentIndex) => {
        if(currentIndex < count){
            let minutes , seconds;
            this.interval = setInterval(() => {
                minutes = parseInt(duration/60);
                seconds = parseInt(duration % 60);
                
                minutes = minutes < 10 ? `0${minutes}` : minutes;
                seconds = seconds < 10 ? `0${seconds}` : seconds;
                this.quizTime.innerHTML = `${minutes} : ${seconds}`

                if(--duration < 0){
                    clearInterval(this.interval);
                    this.submit.click();
                }
            },1000);
        }
    }
}

export default Quiz;