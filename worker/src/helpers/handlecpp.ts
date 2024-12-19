import { exec } from 'child_process';
import * as fs from 'fs';
import axios from 'axios';
import sendResult from './sendResult';

interface Problem {
    userId: string;
    code: string;
    language: string;
}


function handlecpp(problem: Problem): void {
    const userId = problem.userId;
    const code = problem.code;
    const language = problem.language;

    // Define file paths
    const codeFilePath = 'code.cpp';
    const executablePath = 'code.out';
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
        console.error('BACKEND_URL is not defined in environment variables');
        return;
    }

    // Write the C++ code to a file
    fs.writeFileSync(codeFilePath, code);

    // Compile the C++ code
    const compileCommand = `g++ ${codeFilePath} -o ${executablePath}`;

    exec(compileCommand, (compileError, stdout, stderr) => {
        if (compileError) {
            console.error(`Error compiling C++ code: ${compileError}`);
            sendResult( { userId, error: compileError.message });
            return;
        }

        if (stderr) {
            console.error(`Compilation error: ${stderr}`);
            sendResult( { userId, error: stderr });
            return;
        }

        console.log(`Compilation output: ${stdout}`);

        // Run the compiled executable
        const runCommand = `./${executablePath}`;

        exec(runCommand, (runError, runStdout, runStderr) => {
            if (runError) {
                console.error(`Error running compiled code: ${runError}`);
                sendResult( { userId, error: runError.message });
                return;
            }

            if (runStderr) {
                console.error(`Runtime error: ${runStderr}`);
                sendResult( { userId, error: runStderr });
                return;
            }

            console.log(`Program output: ${runStdout}`);
            sendResult( { userId, output: runStdout });
        });
    });
}

export default handlecpp;
