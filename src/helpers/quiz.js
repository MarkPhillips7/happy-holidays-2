import _ from "underscore";

// True only if all correct answers were guessed before guessing any wrong answers.
export const wasEntireQuestionAnsweredCorrectly = (question, guesses) => {
  return (
    guesses &&
    question &&
    question.correctAnswers &&
    guesses.length >= question.correctAnswers.length &&
    _.chain(guesses)
      .first(question.correctAnswers.length)
      .every((guess) => _.contains(question.correctAnswers, guess))
      .value()
  );
};
