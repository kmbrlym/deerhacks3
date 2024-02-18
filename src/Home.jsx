// import React from 'react';
// import { Link} from 'react-router-dom';
// import interviewImage from './assets/Group 18 (2).png';

// export default function Home() {
//   const history = useHistory();

//   const handleStartClick = () => {
//     history.push('/some-path');
//   };

//   return (
//     <>
//       <div className="grid-container">
//         <div className="content-left">
//           <div className="header">Confident Candidate</div>
//           <div className="header-1">
//             Receive <span className="style-1"><em>constructive</em></span> feedback<br /> to ace your next interview
//           </div>
//           <div className="header-2"><em>Transform your interview prep with the power of AI!</em></div>

//           <div className="stat-1">
//             <span className="style-2"><em>94%</em></span>
//             <span className="style-3"><em>of job seekers want interview feedback, but only 41% receive it.<br /> (Linkedin)</em></span>
//           </div>
//           <div className="stat-1">
//             <span className="style-2"><em>73%</em></span>
//             <span className="style-3"><em>of job seekers find job hunting to be one of the most highly stressful moments in their life.<br /> (CareerBuilder)</em></span>
//           </div>
//           <Link to="/App" className="start-btn">GET STARTED</Link>
//         </div>
//         <div className="content-right">
//           <img src={interviewImage} alt="Interview Prep" />
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState } from 'react';
import axios from 'axios';
import Input from './Input';
import FileUpload from './FileUpload';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
// import '@chatscope/chat-ui-kit-react/dist/default/styles.min.css'; // Import the Chat UI Kit styles
import './App.css';
import { Route,Router,Routes, Link} from 'react-router-dom';
import App from './App';

// Sample questions to be shown initially
const initialQuestions = [
  "what is your strongest coding language?",
  "How have you worked in a group setting in the past?"
];

const API_KEY = "YOUR_API_KEY";

function Home() {
  const [industry, setIndustry] = useState("");
  const [job, setJob] = useState("");
  const [messages, setMessages] = useState([
    {
      message:"",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [questions, setQuestions] = useState([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialQuestions, setShowInitialQuestions] = useState(false);

  // Define the systemMessage object here
  const systemMessage = {
    role: "system",
    content: `Give me 5 short interview questions as string in a json array.
    Do not use markdown o format the json, just give me a raw string`
  };

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return {
        role: role,
        content: messageObject.message,
      };
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    };

    await fetch("https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
      return data.json();
    }).then((data) => {
      setQuestions(JSON.parse(data.choices[0].message.content));
      setIsTyping(false);
      setShowInitialQuestions(true); // Set this to true after the user submits the industry and job description
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend(`<p>Industry: ${industry}</p>
    \n<p>Job Description: ${job}</p>`);
    setIndustry("");
    setJob("");
  };

  return (
    <div className="App">
      <div>
        <form onSubmit={handleSubmit}>
          <Input label="industry" value={industry} onChange={setIndustry} />
          <Input label="job" value={job} onChange={setJob} />
          <button type="submit">Submit</button>
        </form>
      </div>
      <hr />
      <h2>Interview questions</h2>
      <div>
        {showFileUpload && <FileUpload />}
        <MainContainer>
          <ChatContainer>
            <MessageList
              className='answer'
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Loading materials" /> : null}
            >
              {messages.map((message, i) => (
                <Message className='container' key={i} model={message}></Message>
              ))}
            </MessageList>
          </ChatContainer>
          {questions.map((question, i) => (
            <div key={i} className='container-interview'>
              <p>{question}</p>
              {showInitialQuestions && <FileUpload number={i} />}
            </div>
          ))}
          {/* Display the initial questions after the user submits the industry and job description */}
          {showInitialQuestions &&
            initialQuestions.map((question, i) => (
              <div key={i} className='container-interview'>
                <p>{question}</p>
                <FileUpload number={questions.length + i} />
              </div>
            ))}
        </MainContainer>
      </div>
    </div>
  );
}

export default Home;

