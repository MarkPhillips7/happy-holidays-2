import { createSlice } from "@reduxjs/toolkit";
import _ from "underscore";

const initialState = {
  allQuestionsGuesses: [], // array of array of guesses in order like [['incorrect guess', 'right on second try'], ['correct guess'], ...]
  currentQuestionIndex: undefined,
  incorrectImageIndex: -1,
  initialized: false,
  quizData: {},
  quizStarted: false,
  shouldDisplayAllPictures: false,
  shouldDisplayQuizResults: false,
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    initializeQuizData: (state, action) => {
      state.currentQuestionIndex = 0;
      state.initialized = true;
      state.quizData = action.payload;
    },
    moveOnToNextQuestion: (state, action) => {
      state.currentQuestionIndex = state.currentQuestionIndex + 1;
    },
    processGuess: (state, action) => {
      const answeredCorrectly = _.contains(
        state.quizData.questions[state.currentQuestionIndex].correctAnswers,
        action.payload
      );
      const allQuestionsGuesses = [...state.allQuestionsGuesses];
      const currentQuestionGuesses =
        allQuestionsGuesses.length > state.currentQuestionIndex
          ? allQuestionsGuesses[state.currentQuestionIndex]
          : [];
      if (currentQuestionGuesses.length === 0) {
        allQuestionsGuesses.push(currentQuestionGuesses);
      }
      if (!_.contains(currentQuestionGuesses, action.payload)) {
        currentQuestionGuesses.push(action.payload);
      }
      const incorrectImageIndex = answeredCorrectly
        ? state.incorrectImageIndex
        : (state.incorrectImageIndex + 1) %
          state.quizData.picturesWhenGuessedIncorrectly.length;
      state.allQuestionsGuesses = allQuestionsGuesses;
      state.answeredCorrectly = answeredCorrectly;
      state.incorrectImageIndex = incorrectImageIndex;
    },

    showPictures: (state) => {
      state.shouldDisplayAllPictures = true;
    },
    showQuizResults: (state) => {
      state.shouldDisplayQuizResults = true;
    },
    startQuiz: (state, action) => {
      state.quizStarted = true;
      state.shouldDisplayAllPictures = false;
    },
  },
});

export const {
  startQuiz,
  showQuizResults,
  showPictures,
  processGuess,
  moveOnToNextQuestion,
  initializeQuizData,
} = quizSlice.actions;

export default quizSlice.reducer;
