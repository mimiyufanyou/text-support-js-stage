import React from 'react';
import AccordionItem from './AccordionItem';

const FAQ = () => {
  const faqData = [
    { question: 'Who will be helping me?', answer: 'Add model details' },
    { question: 'How much does it cost?', answer: 'Add payment details' },
    { question: 'Can ThriveAI substitute for therapy?', answer: 'Thrive is designed to compliment existing therapeutic programs, licensed medical and mental health professionals, and your own initiative for personal growth.' },
    { question: 'How is my privacy protected?', answer: 'Add security & encryption details' },
    { question: 'How does messaging work?', answer: 'You message whenever you want!' },
    { question: 'Is this reimbursable by my insurance?', answer: 'As this is a wellness service some companies have extended wellness programs that may cover this but varies on your employer.' },
    // Add more here
  ];

  return (
    <div className="faq">
      {faqData.map((item, index) => (
        <AccordionItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default FAQ;