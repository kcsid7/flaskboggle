from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def test_initial_conditions(self):
        with app.test_client() as client:
            req = client.get("/")
            self.assertIn('board', session)
            self.assertIsNone(session.get('nplays'))
            self.assertIsNone(session.get('highscore'))

    def test_word(self):
        with app.test_client() as client:
            client.get("/")
            req = client.get("/guess?guess=what")
            self.assertEqual(req.json['check'], 'not-on-board')

    def test_invalid_word(self):
        with app.test_client() as client:
            client.get("/")
            req = client.get("/guess?guess=asdfasdf")
            self.assertEqual(req.json['check'], 'not-word')

        



