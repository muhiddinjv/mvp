import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

// Utility function to shuffle an array
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// Timer Component
const Timer = ({ timeLeft }) => (
    <div className="my-4 text-lg">
        ⏰ Time Left: {timeLeft} seconds
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
        <div className="my-8">
            <h2 className="text-3xl mb-6">{question}</h2>
            {selectedAnswer && (
                <div className="mt-6">
                    <div className={`flex gap-2 items-center justify-center text-2xl my-4 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {isCorrect ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faTimesCircle} />}
                        <p>{isCorrect ? messageForCorrectAnswer : messageForIncorrectAnswer}</p>
                    </div>
                    <p className="hidden m-4 text-3xl">{explanation}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shuffledAnswers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerClick((index + 1).toString())}
                        className={`transition-colors duration-300 ease-in-out p-1 rounded text-3xl font-medium shadow-md ${
                            selectedAnswer === (index + 1).toString()
                                ? isCorrect
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                : 'bg-blue-500 text-white hover:bg-blue-700'
                        }`}
                        disabled={selectedAnswer !== null}
                    >
                        {answer}
                    </button>
                ))}
            </div>



            {showNextButton && (
                <button
                    onClick={showNextButton}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mt-6 transition-colors duration-300 ease-in-out"
                >
                    Next Question
                </button>
            )}
        </div>
    );
};

// Progress Bar Component
const ProgressBar = ({ current, total }) => {
    const progressPercentage = (current / total) * 100;
    return (
        <div className="w-full bg-gray-300 rounded-full h-2.5 mb-6">
            <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    );
};

// QuizResults Component
const QuizResults = ({ score, totalQuestions, totalPoints, maxPoints, handleTryAgain }) => (
    <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">🎉 Quiz Completed!</h1>
        <p className="text-xl mb-4">Correct answers: {score.correct} / {totalQuestions}</p>
        <p className="text-xl mb-4">Total points: {totalPoints} / {maxPoints}</p>
        <button
            onClick={handleTryAgain}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 mt-4 transition-colors duration-300 ease-in-out"
        >
            Try Again
        </button>
    </div>
);


// Main Quiz Component
export const Quiz = ({ quiz, shuffleAnswers = false, shuffleQuestions = false, timer = 0 }) => {
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

    // Calculate the total possible points
    const maxPoints = quiz.statements.reduce(
        (total, statement) =>
            total +
            statement.questions.reduce((qTotal, question) => qTotal + (parseInt(question.point, 10) || 0), 0),
        0
    );

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
            <div className="p-4">
                <h1 className="text-3xl font-bold mb-6">{quiz.quizTitle}</h1>
                <p className="text-lg text-gray-700 mb-6">{quiz.quizSynopsis}</p>
                <button
                    onClick={handleStartQuiz}
                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-700 transition-colors duration-300 ease-in-out"
                >
                    Start Quiz
                </button>
            </div>
        );
    }

    if (quizCompleted) {
        return <QuizResults score={score} totalQuestions={totalQuestions} totalPoints={totalPoints} maxPoints={maxPoints} handleTryAgain={handleTryAgain} />;
    }

    const currentStatement = quizStatements[currentStatementIndex];
    const currentQuestion = currentStatement.questions[currentQuestionIndex];

    // Calculate current question number relative to all questions
    const currentOverallQuestionNumber =
        quizStatements.slice(0, currentStatementIndex).reduce((acc, statement) => acc + statement.questions.length, 0) + currentQuestionIndex + 1;

    return (
        <div className="p-6 max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">{quiz.quizTitle}</h1>
            {timer > 0 && <Timer timeLeft={timeLeft} />}
            <ProgressBar current={currentOverallQuestionNumber} total={totalQuestions} />
            <div className="mt-4">
                <h2 className="text-lg mb-2">
                    Statement {currentStatementIndex + 1}/{quizStatements.length}, Question {currentOverallQuestionNumber}/{totalQuestions}
                </h2>
                <div className="text-3xl mb-4">{currentStatement.statement}</div>
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
