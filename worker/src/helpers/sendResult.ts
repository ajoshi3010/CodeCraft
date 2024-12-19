import axios from 'axios';

async function sendResult(data: any): Promise<void> {
    try {
        const backendUrl = process.env.BACKEND_URL;
        if (!backendUrl) {
            throw new Error('BACKEND_URL is not defined in environment variables');
        }
        await axios.post(`${backendUrl}/output`, data);
    } catch (error) {
        console.error(`Error sending result to backend: ${error}`);
    }
}

export default sendResult;
