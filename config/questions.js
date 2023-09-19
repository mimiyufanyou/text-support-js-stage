// questions.js
const questions = 

  {
    "questions": [
      {
        "id": "q1",
        "text": "How do you primarily deal with challenges?",
        "options": [
          {
            "id": "q1_o1",
            "text": "I confront them head-on.",
            "next": "q1_1"
          },
          {
            "id": "q1_o2",
            "text": "I seek support or knowledge to address them.",
            "next": "q1_2"
          },
          {
            "id": "q1_o3",
            "text": "I try to maintain harmony and balance.",
            "next": "q1_3"
          }
        ]
      },
      {
        "id": "q1_1",
        "text": "How do you see yourself?",
        "options": [
          {
            "id": "q1_1_o1",
            "text": "I strive for success and want to be the best.",
            "result": "Type 3 - The Achiever"
          },
          {
            "id": "q1_1_o2",
            "text": "I stand up for what's right and have a strong sense of justice.",
            "result": "Type 1 - The Reformer"
          },
          {
            "id": "q1_1_o3",
            "text": "I desire control and to protect myself and my environment.",
            "result": "Type 8 - The Challenger"
          }
        ]
      },
      {
        "id": "q1_2",
        "text": "What do you prioritize in life?",
        "options": [
          {
            "id": "q1_2_o1",
            "text": "Being knowledgeable and competent.",
            "result": "Type 5 - The Investigator"
          },
          {
            "id": "q1_2_o2",
            "text": "Building strong, trusting relationships.",
            "result": "Type 2 - The Helper"
          },
          {
            "id": "q1_2_o3",
            "text": "Feeling secure and having a clear guidance.",
            "result": "Type 6 - The Loyalist"
          }
        ]
      },
      {
        "id": "q1_3",
        "text": "What is more in line with your inner feelings?",
        "options": [
          {
            "id": "q1_3_o1",
            "text": "I want to be unique and express my individuality.",
            "result": "Type 4 - The Individualist"
          },
          {
            "id": "q1_3_o2",
            "text": "I desire to have my needs met and to experience life to the fullest.",
            "result": "Type 7 - The Enthusiast"
          },
          {
            "id": "q1_3_o3",
            "text": "I wish for inner and outer peace, avoiding conflicts.",
            "result": "Type 9 - The Peacemaker"
          }
        ]
      }
    ]
  }
  
  module.exports = questions;