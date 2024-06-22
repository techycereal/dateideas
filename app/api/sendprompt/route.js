import axios from 'axios';

export async function POST(Request) {
        const body = await Request.json();
        const response = await axios.post('https://worker.alexanderjmilliken.workers.dev', body);
        const responseString = response.data.response;
        const startIndex = responseString.indexOf("[");
        const endIndex = responseString.lastIndexOf("]");
        const jsonString = responseString.substring(startIndex, endIndex + 1);
        const jsonObject = JSON.parse(jsonString);
        return Response.json({ object: jsonObject });
}
