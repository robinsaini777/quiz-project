// 📦 Imports
import React, { useReducer, useState, useEffect } from 'react';
import './App.css';


// 🧠 Initial State
const initialState = {
  currentQuestionIndex: 0,
  score: 0,
  showResults: false,
  selectedAnswers: [],
  timer: 30, // Timer in seconds
};

// ⚙️ Action Types
const ACTIONS = {
  NEXT_QUESTION: 'next-question',
  SELECT_ANSWER: 'select-answer',
  END_QUIZ: 'end-quiz',
  TICK_TIMER: 'tick-timer',
  RESET_TIMER: 'reset-timer',
};

// 🔁 Reducer Function
function quizReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SELECT_ANSWER:
      return {
        ...state,
        selectedAnswers: [...state.selectedAnswers, action.payload.isCorrect],
        score: action.payload.isCorrect ? state.score + 1 : state.score,
      };

    case ACTIONS.NEXT_QUESTION:
      if (state.currentQuestionIndex + 1 >= action.payload.totalQuestions) {
        return { ...state, showResults: true };
      }
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };

    case ACTIONS.TICK_TIMER:
      return {
        ...state,
        timer: state.timer > 0 ? state.timer - 1 : 0,
      };

    case ACTIONS.RESET_TIMER:
      return {
        ...state,
        timer: 30,
      };

    case ACTIONS.END_QUIZ:
      return {
        ...state,
        showResults: true,
      };

    default:
      return state;
  }
}

// ❓ Quiz Questions Array
const questions = [
  {
    question: 'What is the chemical formula for water?',
    answers: [
      { text: 'H₂O', isCorrect: true },
      { text: 'CO₂', isCorrect: false },
      { text: 'H₂O₂', isCorrect: false },
    ],
    type: 'multiple-choice',
  },
  {
    question: 'What is the national flower of India?',
    answers: [
      { text: 'rose', isCorrect: false },
      { text: 'lotus', isCorrect: true },
    ],
    type: 'true-false',
  },
  {
    question: 'The fastest land animal is the ___.',
    answers: [
      { text: 'Cheetah', isCorrect: true },
      { text: 'lion', isCorrect: false },
      { text: 'rapid', isCorrect: false },
      { text: 'elephant', isCorrect: false },
    ],
    type: 'fill-in-the-blank',
  },
  {
    question: 'Where is City Birds Wildlife Sanctuary?',
    answers: [
      { text: 'chandigarh', isCorrect: true },
      { text: 'delhi', isCorrect: false },
      { text: 'mumbai', isCorrect: false },
    ],
    type: 'multiple-choice',
  },
  {
    question: 'Who is known as the "Father of the Nation" in India?',
    answers: [
      { text: 'Mahatma Gandhi', isCorrect: true },
      { text: 'pandit jawahar lal nehru', isCorrect: false },
    ],
    type: 'true-false',
  },
  {
    question: 'Fill in the blank: The largest planet in our solar system is ___.',
    answers: [
      { text: 'Jupiter', isCorrect: true },
      { text: 'pluto', isCorrect: false },
      { text: 'earth', isCorrect: false },
      { text: 'mars', isCorrect: false },
    ],
    type: 'fill-in-the-blank',
  },
  {
    question: 'Who was the first prime minister of India?',
    answers: [
      { text: 'pandit Jawaharlal Nehru', isCorrect: true },
      { text: 'Mahatma Gandhi', isCorrect: false },
      { text: 'dr.manmohan singh', isCorrect: false },
    ],
    type: 'multiple-choice',
  },
  {
    question: 'What is the largest mammal in the world?',
    answers: [
      { text: 'African Elephant', isCorrect: false },
      { text: 'Blue Whale', isCorrect: true },
      { text: 'Great White Shark', isCorrect: false },
    ],
    type: 'multiple-choice',
  },
  {
    question: 'When did India gain independence?',
    answers: [
      { text: '1947', isCorrect: true },
      { text: '1954', isCorrect: false },
      { text: '2001', isCorrect: false },
    ],
    type: 'multiple-choice',
  },
  {
    question: 'What is the square root of 64?',
    answers: [
      { text: '6', isCorrect: false },
      { text: '7', isCorrect: false },
      { text: '8', isCorrect: true },
    ],
    type: 'multiple-choice',
  },
];

// 🧩 Quiz App Component
function QuizApp() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const currentQuestion = questions[state.currentQuestionIndex];

  // ⏳ Timer Logic
  useEffect(() => {
    if (state.timer === 0) {
      handleNextQuestion();
    }

    const timerInterval = setInterval(() => {
      dispatch({ type: ACTIONS.TICK_TIMER });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [state.timer]);

  // ✅ Handle Answer Selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    dispatch({
      type: ACTIONS.SELECT_ANSWER,
      payload: { isCorrect: answer.isCorrect },
    });
  };

  // 👉 Handle Next Question
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    dispatch({ type: ACTIONS.RESET_TIMER });
    dispatch({ type: ACTIONS.NEXT_QUESTION, payload: { totalQuestions: questions.length } });
  };

  // 🏁 Show Results Section
  if (state.showResults) {
    return (
      <div className="quiz-results">
        <h2>Quiz Results</h2>
        <p className='scr'>Your Score: {state.score}/{questions.length}</p>
        <h3>Review Your Answers:</h3>
        <ul>
          {questions.map((q, index) => (
            <li key={index}>
              <strong>{q.question}</strong> - {state.selectedAnswers[index] ? 'Correct' : 'Incorrect'}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 📋 Main Quiz UI
  return (
    <div className="quiz-app">
      <h1>Quiz Application</h1>
      <div className="question">
        <h2>
          Question {state.currentQuestionIndex + 1}/{questions.length}
        </h2>
        <p>{currentQuestion.question}</p>
        <div className="answers">
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer)}
              disabled={!!selectedAnswer}
              style={{ backgroundColor: selectedAnswer?.text === answer.text ? 'lightblue' : '' }}
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>
      <div className="footer">
        <p>Time Remaining: {state.timer}s</p>
        {selectedAnswer && (
          <button onClick={handleNextQuestion}>Next Question</button>
        )}
      </div>
    </div>
  );
}

export default QuizApp;
