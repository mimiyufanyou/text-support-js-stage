import React, { useState } from 'react';

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => setIsOpen(!isOpen)}>
        {question}
      </div>
      {isOpen && <div className="accordion-content">{answer}</div>}
    </div>
  );
};

export default AccordionItem;