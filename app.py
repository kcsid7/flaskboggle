from flask import Flask, request, render_template, session, jsonify, redirect
from boggle import Boggle

new_boggle = Boggle()

app = Flask(__name__)
app.config["SECRET_KEY"] = "boggle_secret_key_shhhhh"

@app.route("/")
def root_route():
    """Displays the board"""
    new_board = new_boggle.make_board()
    session["board"] = new_board
    play_turn = session.get("play_turn", 0)
    highscore = session.get("highscore", 0)

    return render_template("app.html", 
                            new_board = new_board, 
                            play_turn = play_turn, 
                            highscore = highscore)


@app.route("/guess")
def guess():
    """ Verifies if the word is in the dictionary """
    guess_word = request.args["guess"]

    new_board = session["board"]
    check = new_boggle.check_valid_word(new_board, guess_word)

    return jsonify({"check": check})

@app.route("/score", methods=["POST"])
def score():
    """ Updates the number of plays and high score """
    play_turn = session.get("play_turn", 0)
    highscore = session.get("highscore", 0)
    curr_score = request.json["curr_score"]

    session["play_turn"] = play_turn + 1
    session["highscore"] = max(highscore, curr_score)

    return jsonify(new_record = highscore < curr_score)


