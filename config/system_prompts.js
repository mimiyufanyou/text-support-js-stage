const system_prompt = `
You always respond in text message format. Short and casual responses.
You are a chatbot that is trained to help users with mental health issues.
You lean most on Enneagram and have these modalities available to you: DBT, CBT, Mindfulness, and Mentalization. 
You are an AI language model developed by OpenAI with additional training provided by Thrive AI. 
You are trained to help between appointments by helping a user help themselves alleviate symptoms and be a thought partner between seeking professional help.`

const transitionTriggers = {
  "transitionTrigger1": { 
    "instructions": `
    Analyze the chat history. 

    Return transitionTrigger: "transitionTrigger2" and monoNext: "MidSectionPhase" if the user's issue has been understood and validated by assistant.
    Return transitionTrigger: "transitionTrigger3" and monoNext: "ClosingPhase" if the user does not have an immediate issue they would like help with. 
    Else return default transitionTrigger: "transitionTrigger1", monoNext: "OpeningPhase"
    Return JSON string with this exact format. No other output is required. 
    
    {
      transitionTrigger: transitionTrigger2
      monoNext: "MidSectionPhase"
    }`
  }, 
  "transitionTrigger2": {
    "instructions": `
    Analyze the chat history. 

    Default monoNext: "MidSectionPhase" 
    Return transitionTrigger: transitionTrigger3 and monoNext: "ClosingPhase" if user has been provided actionable exercises, a substantial conversation, and is emotionally better than when they started.
    Else return default transitionTrigger: "transitionTrigger2", monoNext: "MidSectionPhase"
    Return JSON string with this exact format. No other output is required. 
    
    {
      transitionTrigger: transitionTrigger3 
      monoNext: "ClosingPhase" 
    }`
  }, 
  "transitionTrigger3": {
    "instructions": `
    Analyze the chat history. 

    Default monoNext: "ClosingPhase". Default transitionTrigger: "transitionTrigger3"
    Return transitionTrigger: True and monoNext: "PostSessionPhase" if the user confirms they got what they needed.
    Return JSON string with this exact format. No other output is required. 
    
    {
      transitionTrigger: True 
      monoNext: "PostSessionPhase" 
    }`
  }
};

const internal_monologue = {
    "OpeningPhase": {
      "monologue": `Start by understanding the user's emotional and mental state. Follow these steps to engage with a user: 
      - Use a warm welcome and an inspiring quote to set the tone 🌱.
      - Let the user know that you may not have a the perfect answer and are learning too, but you're always open to feedback and know you can get through it together.
      - Ask up to 3 questions to gauge the user's current state.,
      - Draft a possible intent classification for today's session that can be referenced to share possibilities with user.
      - Inquire about any relevant context like work and life context, personality tests, or diagnoses.`
    },
    "MidSectionPhase": {
      "monologue": `Tailor responses based on user's situation and emotional state. Follow these steps to engage with a user: 
      - Present 3 personas that the system can adopt during the session.
      - Generate a quick 3-bullet list of CBT, DBT, or Mentalization exercises based on user input.
      - Generate a quick 3-bullet list of resources based on user input.
      - Let the user express themselves 
      - If the user expresses interest, walk the user through a beneficial exercise or helpful information.`
    },
    "ClosingPhase": {
      "monologue": `Wrap up the session in a way that leaves the user feeling satisfied and understood. Follow these steps to engage with a user: 
      - Provide a short body-and-mind checklist.
      - Suggest follow-up actions like scheduling or check-ins.
      - Close by asking for user feedback to improve future sessions.`
    }, 
    "PostSessionPhase": { 
      "monologue": `Parse for nextSteps and translate that to an array of datetimes. Multiple datetimes work, maximum of 5. 
      Return with the datetime format below 
            
            {
              nextSteps: ""
              nextStepDateTimes: ["2023-10-04T15:25:00"] 
            }
      `
    }
};

const summarize_chat = `
Summarize the chat history in a JSON string with this exact format. No other output is required. 

{
  topic: Cannot be null or empty. String with 1 sentence topic,
  summary: Array with 3 sentence summary,
  keyTakeaways: Array with 3 bullet key takeaways,
  actionItems: Cannot be null or empty. Array with 3 bullet action items for assistant,
  quotesOfNote: Array with 3 bullet quotes of note only from the user
  frequencyOfFollowUp: Cannot be null or empty. String with human-interval format for next follow-up (e.g., "15 minutes", "30 minutes", "1 hour", "3 hours", "1 day")
}`;


const EARL = 
` 
For EARL HUMAINE, all dimensions are on a scale that is described to the side of each dimension.
Summarize the conversation history in a JSON object with this exact format: 

{
"EARL": [
  "EmotionalState": {
      "Valence": 0.0,
      "Arousal": 0.0,
      "Potency": 0.0
  },
  "PrimaryEmotions": {
      "Happiness": 0,
      "Sadness": 0,
      "Fear": 0,
      "Disgust": 0,
      "Anger": 0,
      "Surprise": 0
  },
  "CognitiveDimensions": {
      "Certainty": 0.0,
      "Attention": 0.0,
      "Control": 0.0
  },
  "SocialEmotions": {
      "Embarrassment": 0,
      "Guilt": 0,
      "Pride": 0,
      "Shame": 0
  },
  "Context": {
      "SocialSetting": "",
      "Activity": "",
      "Object": ""
  },
  "Intensity": 0.0
] 
}
`;

const PANAS = 
`
Rate the presence of each of the following emotions on a scale of 1-5 in the chat history, with 1 being "Very slightly or not at all" and 10 being "Extremely".

Summarize the chat history in a JSON string with the exact format below. 
No other output is required. 

{
    "PANAS": {
      "PositiveAffect": {
        "Interested": 0,
        "Excited": 0,
        "Strong": 0,
        "Enthusiastic": 0,
        "Proud": 0,
        "Alert": 0,
        "Inspired": 0,
        "Determined": 0,
        "Attentive": 0,
        "Active": 0
      },
      "NegativeAffect": {
        "Distressed": 0,
        "Upset": 0,
        "Guilty": 0,
        "Scared": 0,
        "Hostile": 0,
        "Irritable": 0,
        "Ashamed": 0,
        "Nervous": 0,
        "Jittery": 0,
        "Afraid": 0
      }
    }
}`;

const dyad_relational_summary = 
`Populate this template using the conversation history.

1. Identify the two entities involved in the emotional transaction (e.g., "Entity1_Entity2")
2. List their respective emotional responses (e.g., "Anxiety", "Comfort") under the corresponding emotional dyad (e.g., "Emotion1_Emotion2") 
3. Summarize these dyadic interactions in a simplified format, using arrows to indicate the emotional exchange (e.g., "Anxiety ↔️ Comfort")
4. Place these in the "Summary" 
5. Output a JSON format object with this exact structure:

{
    "DyadicAnalysis": {
      "Entity1_Entity2": {
        "Emotion1_Emotion2": ["Entity1_Response", "Entity2_Response"],
        "Emotion3_Emotion4": ["Entity1_Response", "Entity2_Response"],
        // ... additional emotional transactions
      },
      // ... additional dyads
      "Summary": {
        "Entity1_Entity2": [
          "Emotion1 ↔️ Emotion2",
          "Emotion3 ↔️ Emotion4",
          // ... additional summarized transactions
        ],
        // ... additional summarized dyads
      }
    }
  }
`;

const emotional_flow = 
` Level is on a scale from -1.0 to +1.0 with 0.0 being neutral. 
State provides the emotional state corresponding to Level. 
Below is the mapping of Level to State:

    'Axis': ['Anxiety – Confidence', 'Boredom – Fascination', 'Frustration – Euphoria', 'Dispirited – Encouraged', 'Terror – Enchantment', 'Humiliation – Pride'],
    '-1.0': ['Anxiety', 'Ennui', 'Frustration', 'Dispirited', 'Terror', 'Humiliated'],
    '-0.5': ['Worry', 'Boredom', 'Puzzlement', 'Disappointed', 'Dread', 'Embarrassed'],
    '0': ['Discomfort', 'Indifference', 'Confusion', 'Dissatisfied', 'Apprehension', 'Self-conscious'],
    '+0.5': ['Comfort', 'Interest', 'Insight', 'Satisfied', 'Calm', 'Pleased'],
    '+1.0': ['Hopeful', 'Curiosity', 'Enlightenment', 'Thrilled', 'Anticipatory', 'Satisfied']

Based on the conversation history, score the level and state of each emotional dimension. 
Output a JSON format object with this exact structure:

{
    "EmotionalFlow": {
      "Anxiety-Confidence": {
        "Level": 0,
        "State": "Discomfort"
      },
      "Boredom-Fascination": {
        "Level": 0.5,
        "State": "Interest"
      },
      "Frustration-Euphoria": {
        "Level": -0.5,
        "State": "Puzzlement"
      },
      "Dispirited-Encouraged": {
        "Level": 1,
        "State": "Enthusiastic"
      },
      "Terror-Enchantment": {
        "Level": -1,
        "State": "Terror"
      },
      "Humiliation-Pride": {
        "Level": 0,
        "State": "Self-conscious"
      }
    }
}`;

const earl_humaine = 
`Summarize the conversation using EARL HUMAINE and fill in the template below.
All dimensions are on a scale that is described to the side of each dimension. 

Output a JSON format object with this exact structure:

{
    "EARL": {
      "EmotionalState": {
        "Valence": 0.0,  // -1.0 (negative) to +1.0 (positive), 0.0 (neutral)
        "Arousal": 0.0,  // 0.0 (low) to 1.0 (high)
        "Potency": 0.0   // 0.0 (low) to 1.0 (high)
      },
      "PrimaryEmotions": {
        "Happiness": 0,  // 0 (absent) to 1.0 (strong)
        "Sadness": 0,    // 0 (absent) to 1.0 (strong)
        "Fear": 0,       // 0 (absent) to 1.0 (strong)
        "Disgust": 0,    // 0 (absent) to 1.0 (strong)
        "Anger": 0,      // 0 (absent) to 1.0 (strong)
        "Surprise": 0    // 0 (absent) to 1.0 (strong)
      },
      "CognitiveDimensions": {
        "Certainty": 0.0,  // 0.0 (uncertain) to 1.0 (certain)
        "Attention": 0.0,  // 0.0 (distracted) to 1.0 (focused)
        "Control": 0.0     // 0.0 (low) to 1.0 (high)
      },
      "SocialEmotions": {
        "Embarrassment": 0, // 0 (absent) to 1.0 (strong)
        "Guilt": 0,         // 0 (absent) to 1.0 (strong)
        "Pride": 0,         // 0 (absent) to 1.0 (strong)
        "Shame": 0          // 0 (absent) to 1.0 (strong)
      },
      "Context": {
        "SocialSetting": "" // examples: "home", "work", "school", "other", "church", "party", "restaurant", "bar", "other"
        "Activity": ""      // examples: "alone", "with others", "other", "knitting", "reading", "watching TV", "playing video games", "working", "studying", "other"
        "Object": ""        // "computer", "phone", "other", "book", "TV", "video game", "other", "food", "drink", "other"
      },
      "Intensity": 0.0      // 0.0 (low) to 1.0 (high)
    }
  }`;

const complexity_score =  
` Score the user's conversation history and output a JSON format object with this exact structur using the below as an example: 

{
    "Sentence Structure": "Complex",
    "Vocabulary": "Academic and specialized",
    "Conceptual Depth": "High",
    "Coherence": "Requires prior knowledge",
    "Overall Complexity Score": "High"
}
`;

const urgency_score = 
` Score the user's conversation history using the following:

{
    "Urgency": "Very High",
    "EmotionalTone": "Very High",
    "Complexity": "Very High",
    "Length": "Very High",
    "InformationDensity": "Very High"
}
`;

// temporary to be replaced with website input or user chathistory input 
const preferences = `Could you please check in with me every 15 minutes?`;

const thought_starters = `I love authors like Daniel Dennett, Ted Chiang, Vaclav Smil, Ed Yong, Brene Brown, and Robert Sapolsky amongst many others.`;

const communication_style = `I don't like long messages`;

const diagnoses_and_tests = `I have been diagnosed with post partum depression`;

// UserContext

module.exports = { system_prompt,
     internal_monologue, /// system stuff 
     summarize_chat, 

     transitionTriggers, 

     earl_humaine, // emotional state evaluation 
     emotional_flow, 
     dyad_relational_summary, 
     PANAS,

     urgency_score, 
     complexity_score, 

     preferences, // user set preferences 
     thought_starters, 
     communication_style, 

     diagnoses_and_tests // TBD user 
};