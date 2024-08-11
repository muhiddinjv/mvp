import React, { useState, useEffect } from "react";

// Utility function to shuffle an array
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// Timer Component
const Timer = ({ timeLeft }) => (
    <div className="mt-4 text-red-600 font-bold">
        Time Left: {timeLeft} seconds
    </div>
);

// Question Component
const Question = ({
    questionObj,
    handleAnswerClick,
    showNextButton,
    selectedAnswer,
    shuffleAnswers,
}) => {
    const { question, answers, messageForCorrectAnswer, messageForIncorrectAnswer, explanation, correctAnswer } = questionObj;

    const [shuffledAnswers, setShuffledAnswers] = useState([]);

    // Shuffle answers only once when the component mounts
    useEffect(() => {
        const shuffled = shuffleAnswers ? shuffleArray([...answers]) : answers;
        setShuffledAnswers(shuffled);
    }, [shuffleAnswers, answers]);

    const isCorrect = selectedAnswer === correctAnswer;

    return (
        <div className="my-4">
            <h2 className="text-lg">{question}</h2>
            <div className="mt-4">
                {shuffledAnswers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerClick((index + 1).toString())}
                        className={`bg-blue-500 text-white p-2 m-2 rounded-md hover:bg-blue-700 ${
                            selectedAnswer === (index + 1).toString() ? 'bg-blue-800' : ''
                        }`}
                        disabled={selectedAnswer !== null}
                    >
                        {answer}
                    </button>
                ))}
            </div>

            {selectedAnswer && (
                <div className="mt-4">
                    <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                        {isCorrect ? messageForCorrectAnswer : messageForIncorrectAnswer}
                    </p>
                    <p className="mt-2 text-gray-700">{explanation}</p>
                </div>
            )}

            {showNextButton && (
                <button
                    onClick={showNextButton}
                    className="bg-green-500 text-white p-3 rounded-md hover:bg-green-700 mt-4"
                >
                    Next
                </button>
            )}
        </div>
    );
};

// QuizResults Component
const QuizResults = ({ score, totalQuestions, totalPoints, handleTryAgain }) => (
    <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz Completed!</h1>
        <p>Correct answers: {score.correct} / {totalQuestions}</p>
        <p>Total points: {totalPoints}</p>
        <button
            onClick={handleTryAgain}
            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-700 mt-4"
        >
            Try Again
        </button>
    </div>
);

// Main Quiz Component
export const Quizz = ({ quiz, shuffleAnswers = false, shuffleQuestions = false, timer = 0 }) => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState({ correct: 0 });
    const [totalPoints, setTotalPoints] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showNextButton, setShowNextButton] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timer);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [quizStatements, setQuizStatements] = useState(quiz.statements);

    const totalQuestions = quiz.statements.reduce((total, statement) => total + statement.questions.length, 0);

    useEffect(() => {
        if (shuffleQuestions) {
            const shuffledStatements = quiz.statements.map(statement => ({
                ...statement,
                questions: shuffleArray([...statement.questions])
            }));
            setQuizStatements(shuffledStatements);
        }
    }, [shuffleQuestions, quiz.statements]);

    useEffect(() => {
        if (quizStarted && !quizCompleted && timer > 0) {
            const countdown = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(countdown);
                        setQuizCompleted(true);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [timer, quizStarted, quizCompleted]);

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setTimeLeft(timer);
    };

    const handleAnswerClick = (selectedAnswer) => {
        setSelectedAnswer(selectedAnswer);
        const correctAnswer = quizStatements[currentStatementIndex].questions[currentQuestionIndex].correctAnswer;
        const points = parseInt(quizStatements[currentStatementIndex].questions[currentQuestionIndex].point, 10) || 0;

        if (selectedAnswer === correctAnswer) {
            setScore({ correct: score.correct + 1 });
            setTotalPoints(totalPoints + points);
        }

        setShowNextButton(true);
    };

    const handleNextQuestion = () => {
        setShowNextButton(false);
        setSelectedAnswer(null);

        if (currentQuestionIndex < quizStatements[currentStatementIndex].questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (currentStatementIndex < quizStatements.length - 1) {
            setCurrentStatementIndex(currentStatementIndex + 1);
            setCurrentQuestionIndex(0);
        } else {
            setQuizCompleted(true);
        }
    };

    const handleTryAgain = () => {
        setQuizStarted(false);
        setCurrentStatementIndex(0);
        setCurrentQuestionIndex(0);
        setScore({ correct: 0 });
        setTotalPoints(0);
        setTimeLeft(timer);
        setQuizCompleted(false);
        setQuizStatements(quiz.statements);
    };

    if (!quizStarted) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">{quiz.quizTitle}</h1>
                <p>{quiz.quizSynopsis}</p>
                <button
                    onClick={handleStartQuiz}
                    className="bg-green-500 text-white p-3 rounded-md hover:bg-green-700 mt-4"
                >
                    Start Quiz
                </button>
            </div>
        );
    }

    if (quizCompleted) {
        return <QuizResults score={score} totalQuestions={totalQuestions} totalPoints={totalPoints} handleTryAgain={handleTryAgain} />;
    }

    const currentStatement = quizStatements[currentStatementIndex];
    const currentQuestion = currentStatement.questions[currentQuestionIndex];

    // Calculate current question number relative to all questions
    const currentOverallQuestionNumber =
        quizStatements.slice(0, currentStatementIndex).reduce((acc, statement) => acc + statement.questions.length, 0) + currentQuestionIndex + 1;

    return (
        <div className="p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">{quiz.quizTitle}</h1>
            {timer > 0 && <Timer timeLeft={timeLeft} />}
            <div className="mt-4">
                <h2 className="text-lg font-semibold">
                    Statement {currentStatementIndex + 1}/{quizStatements.length}, Question {currentOverallQuestionNumber}/{totalQuestions}
                </h2>
                <Question
                    questionObj={currentQuestion}
                    handleAnswerClick={handleAnswerClick}
                    showNextButton={showNextButton ? handleNextQuestion : null}
                    selectedAnswer={selectedAnswer}
                    shuffleAnswers={shuffleAnswers}
                />
            </div>
        </div>
    );
};
