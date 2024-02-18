import React from "react";
import FileUpload from "./FileUpload";

export default function Video(data){
const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

//   const handleFileUpload = (data) => {
//     setUploadedFile(data);
//     // Do something with the data, e.g., save it to state or call an API
//   };

  return (
    <div className="">
      <h1>File Upload Example</h1>
      <div>Yes, this response is inappropriate because it gives a negative 
        impression of being inexperienced and not having any current clients. 
        A better response would be, "I am currently in the process of building my 
        client base and am actively seeking new opportunities through my applications."</div>
    </div>
  );
}