import React, { Component } from "react";
import { quizData } from "./quizData";
import { GreetingsQuiz } from "../GreetingsQuiz/GreetingsQuiz";

export default class Greetings2019 extends Component {
  render() {
    return <GreetingsQuiz multireducerKey="quiz2019" quizData={quizData} />;
  }
}
