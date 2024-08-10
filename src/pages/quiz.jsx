export const quiz = {
  quizTitle: "There is a boy.",
  questions: [
    {
      question: "Is there a boy?",
      questionType: "text",
      answers: ["Yes, there is a boy", "No, there is not a boy"],
      correctAnswer: "1",
      answerSelectionType: "single",
      point: "1",
    },
    {
      question: "Is there a boy or is there a girl?",
      questionType: "text",
      answers: ["There is a boy", "There is a girl"],
      correctAnswer: "1",
      answerSelectionType: "single",
      point: "1",
    },
    {
      question: "Is there a girl?",
      answers: [
        "No, there is not a girl. There is a boy",
        "Yes, there is a girl",
      ],
      correctAnswer: "1",
      questionType: "text",
      answerSelectionType: "single",
      point: "1",
    },
    {
      question: "What is there?",
      questionType: "text",
      answers: ["There is a girl", "There is a boy"],
      correctAnswer: "2",
      answerSelectionType: "single",
      point: "1",
    },
  ],
};
