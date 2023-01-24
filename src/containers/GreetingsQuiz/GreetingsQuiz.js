import React from "react";
import { QuizQuestion, QuizResults } from "components";
import _ from "underscore";
import styles from "./GreetingsQuiz.module.scss";
import {
  initializeQuizData,
  moveOnToNextQuestion,
  processGuess,
  showPictures,
  startQuiz,
  showQuizResults,
} from "features/quiz/quizSlice";
import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

export const GreetingsQuiz = (props) => {
  const dispatch = useDispatch();
  const { multireducerKey, quizData } = props;
  const quiz = useSelector((state) => state[multireducerKey]);
  const {
    allQuestionsGuesses,
    currentQuestionIndex,
    incorrectImageIndex,
    quizStarted,
    shouldDisplayAllPictures,
    shouldDisplayQuizResults,
  } = quiz;
  const allSuccessPictures = _.reduce(
    quizData ? quizData.questions : [],
    (pictureArray, question) => {
      return [...pictureArray, ...question.picturesWhenCorrect];
    },
    []
  );

  useEffect(() => {
    dispatch(initializeQuizData(quizData));
  }, [dispatch, quizData]);

  const introductionImage = quizData.introductionPicture;
  const questionNumber =
    (typeof currentQuestionIndex === "number" && currentQuestionIndex + 1) || 0;
  const currentQuestion =
    (typeof currentQuestionIndex === "number" &&
      quizData.questions[currentQuestionIndex]) ||
    {};
  const currentQuestionGuesses = allQuestionsGuesses[currentQuestionIndex];
  const isAnotherQuestion =
    quizData.questions && currentQuestionIndex < quizData.questions.length - 1;
  const wrongGuessUrl =
    quizData.picturesWhenGuessedIncorrectly &&
    quizData.picturesWhenGuessedIncorrectly[incorrectImageIndex];
  return (
    <div className={`${styles.container} container-fluid`}>
      <div className={`${styles.topBorder}`} />
      <div className={`${styles.leftToRight}`}>
        <div className={`${styles.leftBorder}`} />
        <div className={`${styles.middle}`}>
          {!quizStarted && (
            <div className={styles.preQuiz}>
              <img src={introductionImage} alt="intro" />
              <div className={styles.preQuizForm}>
                <p className={styles.quizIntroduction}>
                  {quizData.introduction}
                </p>
                <button
                  className={`${styles.introButton} btn btn-success`}
                  onClick={() => dispatch(startQuiz())}
                >
                  Bring it on!
                </button>
                <button
                  className={`${styles.introButton} btn btn-danger`}
                  onClick={() => dispatch(showPictures())}
                >
                  Bah Humbug! Just show me some pictures
                </button>
              </div>
            </div>
          )}
          {quizStarted && !shouldDisplayQuizResults && (
            <QuizQuestion
              isAnotherQuestion={isAnotherQuestion}
              question={currentQuestion}
              questionNumber={questionNumber}
              guesses={currentQuestionGuesses}
              onGuess={(answer) => dispatch(processGuess(answer))}
              onNextQuestion={() => dispatch(moveOnToNextQuestion())}
              onShowResults={() => dispatch(showQuizResults())}
              successPictures={currentQuestion.picturesWhenCorrect}
              wrongGuessUrl={wrongGuessUrl}
            />
          )}
          {shouldDisplayQuizResults && (
            <QuizResults
              allQuestionsGuesses={allQuestionsGuesses}
              quizData={quizData}
            />
          )}
          {shouldDisplayAllPictures && (
            <div className={styles.successPictures}>
              {_.map(allSuccessPictures, (picture, index) => {
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
                      title={successImageSource.src}
                      frameBorder="0"
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
                    alt={successImageSource}
                  />
                );
              })}
            </div>
          )}
          {shouldDisplayAllPictures && (
            <h2>Merry Christmas and Happy New Year!</h2>
          )}
          {shouldDisplayAllPictures && (
            <h3>Much love from Mark, Jen, Lily, Willow and Dinah</h3>
          )}
        </div>
        <div className={`${styles.rightBorder}`} />
      </div>
      <div className={`${styles.bottomBorder}`} />
    </div>
  );
};
