//https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple
import Quiz from "./QuizArea.js";
class settings {
    constructor(){
        //get elements
        this.settingsSection = document.querySelector(".settings");
        this.catOptions = Array.from(document.querySelectorAll(`.item input[type="radio"]`));
        this.diffLevels = Array.from(document.querySelectorAll(`.level-content .input-field input[type="radio"]`));
        this.Qnumbers = document.querySelector("input#number");
        this.startBtn = document.querySelector("#start-btn");
        this.quizAreaSection = document.querySelector(".quiz-area");
        this.settingsError = document.querySelector(".popup-error");
        this.popupErrorClose = document.querySelector(".popup-error .close-btn")

        //function to handle active classes of inputs
        this.handleActive();
        //call set quiz function when clicking on start button
        this.startBtn.addEventListener("click" , this.setQuiz);
    }

    handleActive = () => {
        //add checked class to the category option
        let catItems = Array.from(document.querySelectorAll(".menu .item"));
        catItems.forEach((item) => {
            item.addEventListener("click" , () => {
            catItems.forEach((item) => {item.classList.remove("checked")});
            item.classList.add("checked");
            });
        });

        //add the checked class to the difficulty option
        let difficultyLevelsInputFields = Array.from(document.querySelectorAll(".input-field"));
        difficultyLevelsInputFields.forEach((field) => {
            field.addEventListener("click" , () => {
                difficultyLevelsInputFields.forEach((field) => {field.classList.remove("checked")});
                field.classList.add("checked");
            })
        })
    }

    setQuiz = async () => {        
        let amount = this.getAmount();
        let categoryID = this.getCatID();
        let diffLevel = this.getLevel();

        
        let url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryID}&difficulty=${diffLevel}&type=multiple`;
        let result = await this.fetchData(url);
        console.log(result)
        this.quizArea = new Quiz(this.quizAreaSection, result, amount);
        this.clearInputs();
        this.showAndHide();
    }

    //function to clear inputs
    clearInputs = () => {
        this.Qnumbers.value = "";
        this.catOptions.forEach((option) => {
            option.checked = false;
        })
        this.diffLevels.forEach((level) => {
            level.checked = false;
        })
    }

    //function to fetch data
    fetchData = async (url) => {
        let fetchAPI = await fetch(url);
        let response = await fetchAPI.json();
        return response.results;
    }

    showAndHide = () => {
        this.settingsSection.style.display = "none";
        this.quizAreaSection.style.display = "flex";
    }

    //function to get the amount of questions
    getAmount = () => {
        let qnumbers = this.Qnumbers.value;
        if(qnumbers > 0 && qnumbers < 15){
            return qnumbers;
        }else{
            this.settingsError.classList.add("active");
            this.popupErrorClose.classList.add("active");
            this.popupErrorClose.addEventListener("click" , () => {
                this.settingsError.classList.remove("active");
            })
            document.addEventListener("click" , (e) => {
                if(e.target.className != "active" && e.target.className != "start-btn"){
                    this.settingsError.classList.remove("active");
                }
            })
        }
    }


    //function to get difficulty level
    getLevel = () => {
        let level = this.diffLevels.filter((ele) => ele.checked);
        if(level.length === 1){
            return level[0].id;
        }
    }

    //function to get cat ID
    getCatID = () => {
        let checkedCat = this.catOptions.filter((option) => option.checked);
        if(checkedCat.length === 1){
            return checkedCat[0].dataset.id;
        }
    }

}

export default settings;
