import React from 'react';

function SystemMessage({ systemMessage, handleUploadVideo }) {
  return (
    <div>
      <p>{systemMessage.content}</p>
      {handleUploadVideo && (
        <button>Upload Video</button>
      )}
    </div>
  );
}

export default SystemMessage;
