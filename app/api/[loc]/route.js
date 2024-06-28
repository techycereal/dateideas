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
        const API_WEATHER = process.env.API_WEATHER;
        if (!API_WEATHER) {
            throw new Error('API_WEATHER environment variable is not set');
        }

        // Send the GET request to the OpenWeather API
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_WEATHER}`);
        
        // Convert temperature from Kelvin to Fahrenheit
        const kelvinToFahrenheit = (kelvin) => (kelvin - 273.15) * 9 / 5 + 32;
        const temperature = kelvinToFahrenheit(response.data.main.temp);
        const weather = response.data.weather[0].description;

        // Return the API response
        return new Response(JSON.stringify({ weather, temperature }), {
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
