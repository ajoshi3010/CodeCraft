import { exec } from 'child_process';
import * as fs from 'fs';
import axios from 'axios';

interface Problem {
    userId: string;
    code: string;
    language: string;
}

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

async function sendResult(data: any): Promise<void> {
    try {
        const backendUrl = process.env.BACKEND_URL;

        if (!backendUrl) {
            throw new Error('BACKEND_URL is not defined in environment variables');
        }
        await axios.post(process.env.BACKEND_URL + '/output', data);
    } catch (error) {
        console.error(`Error sending result to backend: ${error}`);
    }
}

function handleJavaScript(problem: Problem): void {
    const userId = problem.userId;
    const code = problem.code;

    // Define file paths
    const codeFilePath = 'index.js';

    // Write the JavaScript code to a file
    fs.writeFileSync(codeFilePath, code);

    const runCommand = `node ${codeFilePath}`;
    exec(runCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running JavaScript code: ${error}`);
            sendErrorMessage(userId, error.message);
            return;
        }

        if (stderr) {
            console.error(`Runtime error: ${stderr}`);
            sendErrorMessage(userId, stderr);
            return;
        }

        console.log(`Program output: ${stdout}`);
        sendResult({ userId, output: stdout });
    });
}

export default handleJavaScript;
