import React from 'react';
import AccordionItem from './AccordionItem';
import Section from './Section';  

const FAQ = () => {
  const faqData = [
    { 
      question: `Who will be helping me?`, 
      answer: 
      <>
      You will be assisted by our advanced AI model trained on content from the latest research in neuroscience, psychology, and psychiatry as well as content from certified mental health professional along with non-traditional wellness experts. 
      <br />
      <br />
      Our model is designed to provide evidence-based support and guidance along with a wide variety of holistic modalities based on your own preferences and needs. However, it's important to note that while our AI is powerful, it does not replace the care you would receive from a licensed therapist if you choose that that is necessary for you. 
      </> 
    },
    { 
      question: `How much does it cost?`, 
      answer: 
      <>
      Our basic package starts at $24.99 per month, which includes unlimited messaging, advanced natural language follow-up scheduling, edittable context with facilitated quizzes to help you identify what customizations work best for you. We offer referral incentives and beta-testing programs where the same suite of features are available for reduced rates or free. 
      <br />
      <br /> 
      Financial limitations should not affect your access to expert support. Please contact us if you would like to participate in our beta-testing feedback programs to gain access for free. Payment can be made through various methods including credit/debit cards.
      </>
    },
    { 
      question: `Can ThriveAI substitute for therapy?`, 
      answer: 
      <>
      ThriveAI is designed to complement existing therapeutic programs, licensed medical and mental health professionals, and your own initiative for personal growth. It is not a substitute for professional medical advice, diagnosis, or licensed treatment.
      <br />
      <br />
      However, it is intended to empower you to take control of your own mental health and wellness. We believe that everyone should access to a sympathetic ear whenever needed and have friction-free access to the tools and resources they need to thrive.
      </>
    },
    { 
      question: `How is my privacy protected?`, 
      answer: 
      <>
      Your privacy is our top priority. All data is encrypted and stored securely. We adhere to HIPAA guidelines and employ state-of-the-art security measures to ensure your information is safe and confidential. 
      </> 
    },
    { 
      question: `How does messaging work?`, 
      answer:
      <>Our platform allows for 24/7 messaging. You can send a message whenever you feel like you need support or have a question. Our AI model aims to respond in a timely manner, usually within a few seconds. 
      </>
    },
    { 
      question: `Is this reimbursable by my insurance?`, 
      answer: 
      <>
      ThriveAI is considered a wellness service. Some insurance companies have extended wellness programs that may cover the cost of our service. Reimbursement depends on your specific insurance plan and employer. We recommend checking with your insurance provider for more details.
      </>
    }
  ]

  return (
    <> 
    <div className="main-content">
    <Section> 
      <div className="kpi">
      <h1>Frequently Asked Questions</h1>
      </div> 
    </Section>
    <div>
      {faqData.map((item, index) => (
        <AccordionItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>

    <div className="center-container">
    <div className="orange-colored-circle"></div>
    </div> 
    </div> 
    </>
  );
};

export default FAQ;