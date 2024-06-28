import axios from 'axios';

export async function POST(request) {
    try {
        // Parse the request body
        const body = await request.json();

        // Retrieve the API endpoint from environment variables
        const API_PROMPT = process.env.API_PROMPT;
        if (!API_PROMPT) {
            throw new Error('API_PROMPT environment variable is not set');
        }

        // Send the POST request to the API
        const response = await axios.post(API_PROMPT, body);

        // Extract and parse the JSON string from the response
        const responseString = response.data.response;
        const startIndex = responseString.indexOf('[');
        const endIndex = responseString.lastIndexOf(']');
        const jsonString = responseString.substring(startIndex, endIndex + 1);
        const jsonObject = JSON.parse(jsonString);

        // Return the parsed JSON object
        return new Response(JSON.stringify({ object: jsonObject }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        // Log the error for debugging
        console.error('Error in POST request:', error);

        // Return an error response
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
