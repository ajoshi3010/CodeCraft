import {  useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import useWebSocket from "../hooks/Websocket";
import randomNumber from "../utils/NumGenerator";

const EditorComponent = () => {
  const [code, setCode] = useState("//Enter Your Code\nconsole.log('ROHAN')");
  const [output, setOutput] = useState(""); 
  const [language, setLanguage] = useState("javascript"); // State for selected language
  const randomUserId = randomNumber;
  const socket = useWebSocket();
  
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      console.log("message arrived");
      const message = event.data;
      setOutput(message);
    };
  }, [socket]);

  const handleSubmit = () => {
    const requestBody = {
      userId: randomUserId,
      code,
      language,
    };

    socket?.send(JSON.stringify(requestBody));
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
    // Update the editor content according to language if needed
    if (event.target.value === 'python') {
      setCode('# Enter Your Code\nprint("ROHAN")');
    } else if (event.target.value === 'cpp') {
      setCode('// Enter Your Code\n#include <iostream>\nusing namespace std;\nint main() {\n  cout << "ROHAN" << endl;\n  return 0;\n}');
    } else if (event.target.value === 'java') {
      setCode('// Enter Your Code\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("ROHAN");\n  }\n}');
    } else {
      setCode("// Enter Your Code\nconsole.log('ROHAN')");
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col sm:m-0">
        <div className="flex justify-between bg-gray-900 p-2">
          <select
            className="bg-gray-800 text-white p-2 rounded"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div className="sm:h-[50vh] md:h-full">
          <MonacoEditor
            language={language}
            value={code}
            onChange={(value) => setCode(value!)}
            theme="vs-dark"
            options={{
              scrollbar: { vertical: "visible", verticalScrollbarSize: 10 },
            }}
          />
        </div>
      </div>
      <div className="bg-gray-950 p-4 m-0 h-[50vh] md:h-full block ">
        <p className="text-2xl text-slate-200 whitespace-pre-line ">
          Output: {output}
          <span className="bg-white animate-pulse transition-all">l</span>
        </p>
      </div>
    </div>
  );
};

export default EditorComponent;
