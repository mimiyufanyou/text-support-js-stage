import React, { useState } from 'react';

const questions = [
  {
    question: 'How do you handle stress?',
    options: ['I seek solitude', 'I focus on tasks', 'I seek social support'],
  },
  {
    question: 'What motivates you the most?',
    options: ['Achievement', 'Peace', 'Connection'],
  },
  {
    question: 'What is your biggest fear?',
    options: ['Being worthless', 'Being unloved', 'Being controlled'],
  },
  {
    question: 'How do you approach problems?',
    options: ['I tackle them head-on', 'I analyze the details', 'I go with my gut feeling'],
  },
  {
    question: 'What do you value most in relationships?',
    options: ['Loyalty', 'Understanding', 'Independence'],
  },
  {
    question: 'How do you see yourself?',
    options: ['I am competent and efficient', 'I am caring and compassionate', 'I am unique and different'],
  },
  {
    question: 'What is your approach to work?',
    options: ['I strive for perfection', 'I aim to be successful', 'I want to make a difference'],
  },
  {
    question: 'What do you struggle with the most?',
    options: ['Fear and anxiety', 'Anger and frustration', 'Sadness and disconnection'],
  }
];

const typeDescriptions = {
  Type1: 'The Perfectionist: Rational, Idealistic',
  Type2: 'The Helper: Caring, Interpersonal',
  Type3: 'The Achiever: Success-Oriented, Pragmatic',
  Type4: 'The Individualist: Sensitive, Withdrawn',
  Type5: 'The Investigator: Intense, Cerebral',
  Type6: 'The Loyalist: Committed, Security-Oriented',
  Type7: 'The Enthusiast: Busy, Fun-Loving',
  Type8: 'The Challenger: Powerful, Dominating',
  Type9: 'The Peacemaker: Easygoing, Self-Effacing'
};

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [typeCount, setTypeCount] = useState({ Type1: 0, Type2: 0, Type3: 0, Type4: 0, Type5: 0, Type6: 0 });

  const handleAnswer = (type) => {
    setTypeCount({ ...typeCount, [type]: typeCount[type] + 1 });

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      const dominantType = Object.keys(typeCount).reduce((a, b) => (typeCount[a] > typeCount[b] ? a : b));
      alert(`Quiz finished! Your dominant type is ${dominantType}: ${typeDescriptions[dominantType]}`);
    }
  };

  return (
    <div>
      <h1>{questions[currentQuestion].question}</h1>
      <div>
        {questions[currentQuestion].options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;