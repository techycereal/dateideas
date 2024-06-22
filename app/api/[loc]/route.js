import axios from 'axios';

export async function GET(Request, { params }) {
        const kelvinToFahrenheit = (kelvin) => (kelvin - 273.15) * 9 / 5 + 32;
        const lat = params.loc.split(',')[0]
        const lng = params.loc.split(',')[1]
        console.log(params.loc)
        console.log(lng)
        console.log(lat)
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=68c43d91d9dd320c3b1384107916c06c`);
        const temperature = kelvinToFahrenheit(response.data.main.temp);
        const weather = response.data.weather[0].description;
        return Response.json({weather, temperature});
}
