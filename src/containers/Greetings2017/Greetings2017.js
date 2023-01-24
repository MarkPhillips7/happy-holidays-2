import React, { Component } from "react";
import { GreetingsQuiz } from "../GreetingsQuiz/GreetingsQuiz";
import { quizData } from "./quizData";

export default class Greetings2017 extends Component {
  render() {
    return <GreetingsQuiz multireducerKey="quiz2017" quizData={quizData} />;
  }
}
