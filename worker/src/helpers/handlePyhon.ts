import { exec } from 'child_process';
import * as fs from 'fs';
import sendResult from './sendResult';

interface Problem {
    userId: string;
    code: string;
    language: string;
}

function handlePython(problem: Problem): void {
    const userId = problem.userId;
    const code = problem.code;

    // Define file paths
    const codeFilePath = 'code.py';

    // Write the Python code to a file
    fs.writeFileSync(codeFilePath, code);

    const runCommand = `python3 ${codeFilePath}`;
    exec(runCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running Python code: ${error}`);
            sendResult({ userId, error: error.message });
            return;
        }

        if (stderr) {
            console.error(`Runtime error: ${stderr}`);
            sendResult({ userId, error: stderr });
            return;
        }

        console.log(`Program output: ${stdout}`);
        sendResult({ userId, output: stdout });
    });
}

export default handlePython;
