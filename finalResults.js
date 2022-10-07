class final {
    constructor (quizArea, N_Of_correct, count){
        //get elements
        this.result = document.querySelector(".results");
        this.closeBtn = document.querySelector(".results .close");
        this.popupIcon = document.querySelector(".popup-result .icon img");
        this.popupScore = document.querySelector(".popup-result .score");
        this.popupCongrats = document.querySelector(".popup-result .congrats");
        this.popupState = document.querySelector(".popup-result .quiz-state");
        this.popupattemptsSpan1 = document.querySelector(".popup-result .attempts span:nth-child(1)");
        this.popupattemptsSpan2 = document.querySelector(".popup-result .attempts span:nth-child(2)");

        this.endQuiz(quizArea, N_Of_correct, count);
    }

    endQuiz = (quizArea, N_Of_correct, count) =>{
        this.result.classList.add("active");
        this.popupattemptsSpan1.innerHTML = count;
        this.popupattemptsSpan2.innerHTML = N_Of_correct;
        let percentage = Math.round((N_Of_correct * 100) / count ) + "%";
        this.popupScore.innerHTML = percentage + "score";
        console.log(percentage , N_Of_correct)
        if(percentage <= "50"){
            this.popupCongrats.innerHTML = "wrong!"
            this.popupIcon.src = "./img/emoji.png";
            this.popupState.innerHTML = "quiz completed unsuccessfully.";
        }else{
            this.popupCongrats.innerHTML = "congrats!"
            this.popupIcon.src = "./img/trophy.png";
            this.popupState.innerHTML = "quiz completed successfully.";
        }

        //reload app onclick on window
        document.addEventListener("click" , (e) => {
            if(e.target.className != "active" && e.target.className != "submit"){
                location.reload();
            }
        })
    
        //reload app onclick the close btn
        this.closeBtn.onclick = function (){
            location.reload();
        }
    }
}

export default final;