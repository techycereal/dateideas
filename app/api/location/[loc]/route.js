import axios from 'axios';

export async function GET(request, { params }) {
    try {
        // Validate the 'loc' parameter
        if (!params || !params.loc) {
            throw new Error('Location parameter "loc" is missing');
        }

        // Extract latitude and longitude from the 'loc' parameter
        const [lat, lng] = params.loc.split(',');
        if (!lat || !lng) {
            throw new Error('Invalid location format. Expected "lat,lng"');
        }

        // Retrieve the API endpoint from environment variables
        const API_LOC = process.env.API_LOC;
        if (!API_LOC) {
            throw new Error('API_LOC environment variable is not set');
        }

        // Send the GET request to the LocationIQ API
        const response = await axios.get(`https://us1.locationiq.com/v1/reverse?key=${API_LOC}&lat=${lat}&lon=${lng}&format=json`);

        // Return the API response
        return new Response(JSON.stringify({ data: response.data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        // Log the error for debugging
        console.error('Error in GET request:', error);

        // Return an error response
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
