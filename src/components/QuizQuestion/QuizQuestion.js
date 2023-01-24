import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import {
  theWordWrongSource,
  theWordRightSource,
  theWordsSoFarSoGood,
  theWordFinally,
  thatsMoreLikeIt,
  whatAreYouDoing,
} from "helpers/images";
import { wasEntireQuestionAnsweredCorrectly } from "helpers/quiz";
import styles from "./QuizQuestion.module.scss";

export default class QuizQuestion extends Component {
  static propTypes = {
    guesses: PropTypes.array,
    isAnotherQuestion: PropTypes.bool,
    wrongGuessUrl: PropTypes.string,
    question: PropTypes.object,
    questionNumber: PropTypes.number,
    onGuess: PropTypes.func,
    onNextQuestion: PropTypes.func,
    onShowResults: PropTypes.func,
    successPictures: PropTypes.array,
  };

  // True as long as all correct answers have been guessed, even if wrong answers were guessed as well.
  wereAllCorrectAnswersSelected() {
    const { guesses, question } = this.props;
    return (
      guesses &&
      question &&
      question.correctAnswers &&
      _.every(question.correctAnswers, (correctAnswer) =>
        _.contains(guesses, correctAnswer)
      )
    );
  }

  // True only if all correct answers were guessed before guessing any wrong answers.
  wasEntireQuestionAnsweredCorrectly() {
    const { guesses, question } = this.props;
    return wasEntireQuestionAnsweredCorrectly(question, guesses);
  }

  wasQuestionOnlyPartiallyAnsweredCorrectly() {
    const { guesses, question } = this.props;
    return (
      guesses &&
      question &&
      question.correctAnswers &&
      guesses.length > 0 &&
      guesses.length < question.correctAnswers.length &&
      _.every(guesses, (guess) => _.contains(question.correctAnswers, guess))
    );
  }

  wasMostRecentGuessCorrect() {
    const { guesses, question } = this.props;
    return (
      guesses &&
      question &&
      question.correctAnswers &&
      guesses.length > 0 &&
      _.contains(question.correctAnswers, guesses[guesses.length - 1])
    );
  }

  render() {
    const {
      guesses,
      isAnotherQuestion,
      question,
      questionNumber,
      onGuess,
      onNextQuestion,
      onShowResults,
      successPictures,
      wrongGuessUrl,
    } = this.props;
    const mostRecentGuessStatuses = {
      noGuessesYet: 1,
      partiallyAnswered: 2,
      perfect: 3,
      mostRecentGuessWrongButOverallRight: 4,
      mostRecentGuessRightButOnlyPartialAnswer: 5,
      mostRecentGuessRightButOverallWrong: 6,
      wrong: 7,
    };
    const mostRecentGuessWasCorrect = this.wasMostRecentGuessCorrect();
    const entireQuestionAnsweredCorrectly =
      this.wasEntireQuestionAnsweredCorrectly();
    const questionUnlocked = this.wereAllCorrectAnswersSelected();
    let mostRecentGuessStatus;
    if (entireQuestionAnsweredCorrectly) {
      if (mostRecentGuessWasCorrect) {
        mostRecentGuessStatus = mostRecentGuessStatuses.perfect;
      } else {
        mostRecentGuessStatus =
          mostRecentGuessStatuses.mostRecentGuessWrongButOverallRight;
      }
    } else {
      if (this.wasQuestionOnlyPartiallyAnsweredCorrectly()) {
        mostRecentGuessStatus = mostRecentGuessStatuses.partiallyAnswered;
      } else {
        if (questionUnlocked) {
          if (mostRecentGuessWasCorrect) {
            mostRecentGuessStatus =
              mostRecentGuessStatuses.mostRecentGuessRightButOverallWrong;
          } else {
            mostRecentGuessStatus = mostRecentGuessStatuses.wrong;
          }
        } else {
          if (guesses && guesses.length > 0) {
            if (mostRecentGuessWasCorrect) {
              mostRecentGuessStatus =
                mostRecentGuessStatuses.mostRecentGuessRightButOnlyPartialAnswer;
            } else {
              mostRecentGuessStatus = mostRecentGuessStatuses.wrong;
            }
          } else {
            mostRecentGuessStatus = mostRecentGuessStatuses.noGuessesYet;
          }
        }
      }
    }
    const successImage = require("images/dinah-wink.jpg");
    const showNextButton = questionUnlocked && isAnotherQuestion;
    const showQuizFinishedButton = questionUnlocked && !isAnotherQuestion;
    return (
      <div className={styles.quizQuestionWithEverything}>
        <div className={styles.quizQuestion}>
          <div className={styles.quizQuestionMiddle}>
            {question && question.introduction && (
              <p className={styles.questionIntroduction}>
                {question.introduction}
              </p>
            )}
            {question && question.question && (
              <div className={styles.question}>
                {questionNumber}. {question.question}
              </div>
            )}
            {question && question.answers && (
              <div className={styles.answers}>
                {_.map(question.answers, (answer, index) => {
                  const answerGuessed = guesses && _.contains(guesses, answer);
                  const isCorrectAnswer = _.contains(
                    question.correctAnswers,
                    answer
                  );
                  let correctWrong = "";
                  if (answerGuessed) {
                    correctWrong = isCorrectAnswer
                      ? ` ${styles.correct}`
                      : ` ${styles.wrong}`;
                  }
                  const color = isCorrectAnswer
                    ? " text-success"
                    : " text-danger";
                  const checked = answerGuessed ? ` checked${color}` : "";
                  const answerDivClassName = `${styles.answer}${checked}`;
                  const answerTextClassName = `${correctWrong}`;
                  let icon;
                  if (answerGuessed && isCorrectAnswer) {
                    icon = (
                      <i
                        className={`${styles.iconRadioButton} fa-regular fa-circle-check fa-2x`}
                      />
                    );
                  } else if (checked) {
                    icon = (
                      <i
                        className={`${styles.iconRadioButton} fa fa-times-circle-o fa-2x`}
                      />
                    );
                  } else {
                    icon = (
                      <i
                        className={`${styles.iconRadioButton} fa fa-circle-o fa-2x`}
                      />
                    );
                  }
                  return (
                    <div
                      key={index}
                      className={answerDivClassName}
                      disabled={false}
                      onClick={(event) => {
                        event.preventDefault();
                        onGuess(answer);
                      }}
                    >
                      {icon}
                      <div className={answerTextClassName}>{answer}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className={styles.quizQuestionLeftRight}>
            {mostRecentGuessStatus ===
              mostRecentGuessStatuses.partiallyAnswered && (
              <div className={styles.rightWrongDiv}>
                <img className={styles.rightWrong} src={theWordsSoFarSoGood} />
              </div>
            )}
            {mostRecentGuessStatus ===
              mostRecentGuessStatuses.mostRecentGuessRightButOnlyPartialAnswer && (
              <div className={styles.rightWrongDiv}>
                <img className={styles.rightWrong} src={thatsMoreLikeIt} />
              </div>
            )}
            {mostRecentGuessStatus ===
              mostRecentGuessStatuses.mostRecentGuessRightButOverallWrong && (
              <div className={styles.rightWrongDiv}>
                <img className={styles.rightWrong} src={theWordFinally} />
              </div>
            )}
            {mostRecentGuessStatus === mostRecentGuessStatuses.perfect && (
              <div className={styles.rightWrongDiv}>
                <img className={styles.rightWrong} src={theWordRightSource} />
                <img className={styles.rightWrong} src={successImage} />
              </div>
            )}
            {mostRecentGuessStatus ===
              mostRecentGuessStatuses.mostRecentGuessWrongButOverallRight && (
              <div className={styles.rightWrongDiv}>
                <img className={styles.rightWrong} src={whatAreYouDoing} />
              </div>
            )}
            {mostRecentGuessStatus === mostRecentGuessStatuses.wrong && (
              <div className={styles.rightWrongDiv}>
                <img className={styles.rightWrong} src={theWordWrongSource} />
                <img className={styles.rightWrong} src={wrongGuessUrl} />
              </div>
            )}
          </div>
        </div>
        {questionUnlocked && (
          <div className={styles.successPictures}>
            {_.map(successPictures, (picture, index) => {
              const successImageSource = picture;
              if (typeof successImageSource === "object") {
                return (
                  <iframe
                    key={index}
                    className={styles.successIFrame}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    width={successImageSource.width}
                    height={successImageSource.height}
                    src={successImageSource.src}
                    frameBorder="0"
                    title="success"
                  ></iframe>
                );
              }
              return (
                <img
                  key={index}
                  width={successImageSource.width}
                  height={successImageSource.height}
                  className={styles.successImage}
                  src={successImageSource}
                  alt="success"
                />
              );
            })}
          </div>
        )}
        {showNextButton && (
          <button
            className={`${styles.nextButton} btn btn-success`}
            onClick={onNextQuestion}
          >
            Next Question Please
          </button>
        )}
        {showQuizFinishedButton && (
          <button
            className={`${styles.nextButton} btn btn-success`}
            onClick={onShowResults}
          >
            All Finished, Go to Results!
          </button>
        )}
      </div>
    );
  }
}
