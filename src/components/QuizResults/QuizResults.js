import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import { wasEntireQuestionAnsweredCorrectly } from "../../helpers/quiz";

export default class QuizQuestion extends Component {
  static propTypes = {
    allQuestionsGuesses: PropTypes.array,
    quizData: PropTypes.object,
  };

  render() {
    const { allQuestionsGuesses, quizData } = this.props;
    if (!quizData) {
      return <div />;
    }
    const { questions, resultsByHowManyCorrect } = quizData;
    const styles = require("./QuizResults.scss");
    const totalCorrectResponses = _.reduce(
      allQuestionsGuesses || [],
      (runningTotal, guesses, index) => {
        return (
          runningTotal +
          wasEntireQuestionAnsweredCorrectly(quizData.questions[index], guesses)
        );
      },
      0
    );
    const results = resultsByHowManyCorrect[totalCorrectResponses] || {};
    const score =
      questions && Math.round((totalCorrectResponses * 100) / questions.length);
    return (
      <div className={styles.quizResults}>
        <h2>Quiz Results</h2>
        <h3>
          {score} % - {results.comment}
        </h3>
        <br />
        <h2>Merry Christmas and Happy New Year!</h2>
        <h3>Much love from Mark, Jen, Lily, Willow and Dinah</h3>
      </div>
    );
  }
}
