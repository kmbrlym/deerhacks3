import { useState } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import Input from './Input';

const API_KEY = "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";

function App() {
  const [industry, setIndustry] = useState("");
  const [job, setJob] = useState("");
  const [messages, setMessages] = useState([
    {
      message:"",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Define the systemMessage object here
  const systemMessage = {
    role: "system",
    content: `Get me 5 points short interview questions wrap in <p class='interview'> tag as a role of ${job} in for industry ${industry}`
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
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
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
        <hr></hr>
        <h2>Interview questions</h2>
      <div>
        <MainContainer>
          <ChatContainer>
            <MessageList
              className='answer'
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Loading materials" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message className='container' key={i} model={message} />
              })}
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
