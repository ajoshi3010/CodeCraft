import { Redis } from "ioredis";
import { exec } from 'child_process';
import * as fs from 'fs';
import axios from 'axios';
import express from 'express'; 
import handlecpp from './helpers/handlecpp'
import handleJava from './helpers/handlejava'
import handlePython from "./helpers/handlePyhon";
import handleJavaScript from "./helpers/handleJavascript";
require('dotenv').config(); 

//console.log(process.env.REDIS_URL!);

const client = new Redis(process.env.REDIS_URL!);

interface Problem {
    userId: string,
    code: string,
    language: string
}

const app = express();

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/',(req,res)=>{
    res.status(200).json({message:"Hello World"})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



async function main() {
    while (true) {
        const res = await client.brpop("submissions", 0);
        if (res) {
            const element = res[1];
            if (element) {
                const problem: Problem = JSON.parse(element);
                const userId = problem.userId;
                const code = problem.code;
                const language=problem.language;

                if(language==='cpp'){
                    handlecpp(problem);
                    continue;
                }
                if(language=='java'){
                    handleJava(problem);
                    continue;
                }
                if(language=='python'){
                    handlePython(problem);
                    continue;
                }

                if(language=='javascript'){
                    handleJavaScript(problem)
                    continue
                }
            }
        }
    }
}

// Function to send error messages
function sendErrorMessage(userId: string, errorMessage: string) {
    let errorSummary = ''; // Initialize empty string for error summary

    // Split the error message by newline and extract the specific error message
    const errorLines = errorMessage.split('\n');
    console.log(errorLines)
    if (errorLines.length >= 4) {
        errorSummary = errorLines[2] + '\n' + errorLines[5];
    } else {
        errorSummary = 'An error occurred during code execution';
    }

    // Send only the error summary to the frontend
    axios.post(process.env.BACKEND_URL + '/output', { userId, error: errorSummary })
        .then(response => console.log(response.data))
        .catch(error => console.error(`Error sending error message: ${error}`));
}

// Function to send output messages
function sendOutputMessage(userId: string, output: string) {
    axios.post(process.env.BACKEND_URL + '/output', { userId, output })
        .then(response => console.log(response.data))
        .catch(error => console.error(`Error sending output message: ${error}`));
}

// Start the main worker function
main();
