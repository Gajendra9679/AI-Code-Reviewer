import React, { useEffect,useRef, useState } from "react";
import { Sun,Moon} from "lucide-react"
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme like VS Code
import "prismjs/components/prism-javascript"; // Add more for different languages
import Editor from "react-simple-code-editor"; 
import axios from "axios"
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"


function App(){
    const [code,setCode]=useState("")
    const [reviewResults, setReviewResults] = useState(null);
    const [darkMode,setDarkMode]=useState(()=>{
        return localStorage.getItem("theme")==='dark'
    });

    const fileInputRef=useRef(null);

    
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (!file) return;
      
        const reader = new FileReader();
      
        reader.onload = (e) => {
          console.log("File content:", e.target.result); // Debugging: Check if file content is read
          setCode(e.target.result); // Set file content in the state
        };
      
        reader.onerror = (err) => {
          console.error("Error reading file:", err);
        };
      
        reader.readAsText(file); // Read file as text
      };

    const handleUpload=()=>{
        if (fileInputRef.current) {
            fileInputRef.current.click();
          }
    }

    useEffect(() => {
        if (darkMode) {
                document.documentElement.classList.add("dark");
        } else {
                document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        console.log("Dark mode:", darkMode);
        console.log("HTML classes:", document.documentElement.classList);
    
      }, [darkMode]);

    const handleReview=async ()=>{
        const res=await axios.post('http://localhost:5000/ai/get-review',{code})
    
        setReviewResults(res.data)
    }   

    return(

        
        <div className="min-h-screen flex flex-col items-center p-6 transition-all bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-gray-300">
            {/* Header Section */}
            <div className="flex justify-between items-center w-full max-w-full mb-6">
                <h1 className="text-3xl font-bold">⚡ AI Code Reviewer</h1>
                <button
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                onClick={() => setDarkMode((prevMode) => !prevMode)}
                >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
            </div>
            {/* Main Content : code input + reviewed results */}

            <div className="flex w-full gap-6 mt-6 p-4 max-w-full ">

                {/* Left-part : Code Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".js,.txt,.c,.cpp,.java"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div className="w-1/2">
                    <h2 className="text-lg font-semibold mb-2">✍️ Enter Your Code</h2>
                    <div className="relative w-full  border border-gray-400 dark:border-gray-600 rounded-lg">
                    <Editor
                value={code}
                onValueChange={(newCode) => setCode(newCode)}
                highlight={(code) => Prism.highlight(code, Prism.languages.javascript, "javascript")}
                padding={10}
                className="text-white text-sm font-mono min-h-120 max-h-96 bg-zinc-300 dark:bg-zinc-700 overflow-auto rounded-lg"
                />
          </div>
                    <div className="flex justify-between mt-4">
                        <button className="bg-blue-500 px-4 py-2 rounded-lg text-white" onClick={handleUpload}>Upload File</button>
                        <button onClick={handleReview} className="bg-green-500 px-4 text-white py-2 rounded-lg">Review Code</button>
                    </div>
                </div>
                
                {/* RIght-part : Review and Results part */}
                <div className="w-1/2 mt-1">
                    <h2 className="text-lg font-semibold mb-2">📊 Review Results</h2>
                    <div className="p-4  rounded-lg h-120 overflow-auto bg-zinc-300 dark:bg-zinc-700">
                                            {reviewResults ? (
                            <ReactMarkdown
                            components={{
                                code({ inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                    >
                                    {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className="bg-gray-800 text-white px-1 rounded" {...props}>
                                    {children}
                                    </code>
                                );
                                },
                            }}
                            >
                            {reviewResults}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Your AI review will appear here.</p>
                        )}
                    </div>


                    {/* <h2 className="mt-4 text-lg font-semibold ">✅ Fixed Code</h2>
                    <div className="p-4 mt-3 rounded-lg h-32 overflow-auto bg-zinc-300 dark:bg-zinc-700">
                        {fixedCode ? <pre className="p-3 rounded-md">{fixedCode}</pre> : <p className="text-gray-500 dark:text-gray-400">AI's fixed code will appear here.</p>}
                    </div> */}
                </div>

            </div>
        </div>
    )
}

export default App