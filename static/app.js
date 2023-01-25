class Boggle {
    // create a new boggle game
    constructor(board_name, time) {
        this.board = $(`#${board_name}`);
        this.time = time;
        this.score = 0;
        this.found_words = new Set();

        this.timer_func = this.timer_func.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.timer = setInterval(this.timer_func, 1000);
        
        $(".time_left", this.board).text(this.time);
        $("#guess_form", this.board).on("submit", this.handleSubmit);
    }

    displayMessage(message) {
        $("#messages", this.board).text(message)
    }
    

    async handleSubmit(evt) {
        
        evt.preventDefault();
        const inputWord = $("#guess_input", this.board).val();

        if (!inputWord) return;

        if (this.found_words.has(inputWord)) {
            $("#messages", this.board).text(`${inputWord} already found!`);
            $word.val("").focus();
            return;
        }

        const checkWord = await axios.get("/guess", { params: { guess: inputWord }})

        const checkWord_res = checkWord.data.check;

        if (checkWord_res == "not-on-board") {
            $("#messages", this.board).text(`${inputWord} not in board. Try Again!`);
        }
        else if (checkWord_res === "not-word") {
            $("#messages", this.board).text(`${inputWord} is not a word. Try Again!`);
        } 
        else {
            $("#guessed_words", this.board).append($("<li>", { text: inputWord }));
            this.score += inputWord.length;
            $(".curr_score", this.board).text(this.score);
            this.found_words.add(inputWord);
        }

        $("#guess_input", this.board).focus().val("");

    }

    async timer_func() {
        this.time -= 1;
        $(".time_left").text(this.time);

        if (this.time === 0) {
            clearInterval(this.timer);
            await this.gameOver();
        }
    }

    async gameOver() {
        console.log("Ran Game Over");
        const game_over = await axios.post("/score", {curr_score: this.score})
        game_over.data.new_record ? 
            $("#messages", this.board).text(`${this.score} is the new boggle record`) 
            : $("#messages", this.board).text(`${this.score} is your score`); 
    }

}