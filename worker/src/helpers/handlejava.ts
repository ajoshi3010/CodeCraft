import { exec } from 'child_process';
import * as fs from 'fs';
import sendResult from './sendResult';

interface Problem {
    userId: string;
    code: string;
    language: string;
}

function handleJava(problem: Problem): void {
    const userId = problem.userId;
    const code = problem.code;
    const backendUrl = process.env.BACKEND_URL;
    const codeFilePath = 'Main.java';

    if (!backendUrl) {
        console.error('BACKEND_URL is not defined in environment variables');
        return;
    }

    // Write the Java code to a file
    fs.writeFileSync(codeFilePath, code);

    // Compile the Java code
    const compileCommand = 'javac Main.java';

    exec(compileCommand, (compileError, stdout, stderr) => {
        if (compileError) {
            console.error(`Error compiling Java code: ${compileError}`);
            sendResult({ userId, error: compileError.message });
            return;
        }

        if (stderr) {
            console.error(`Compilation error: ${stderr}`);
            sendResult({ userId, error: stderr });
            return;
        }

        console.log(`Compilation output: ${stdout}`);

        // Run the compiled Java program
        const runCommand = 'timeout 5s java Main';

        exec(runCommand, (runError, runStdout, runStderr) => {
            if (runError) {
                console.error(`Error running compiled code: ${runError}`);
                sendResult({ userId, error: runError.message });
                return;
            }

            if (runStderr) {
                console.error(`Runtime error: ${runStderr}`);
                sendResult({ userId, error: runStderr });
                return;
            }

            console.log(`Program output: ${runStdout}`);
            sendResult({ userId, output: runStdout });
        });
    });
}

export default handleJava;
