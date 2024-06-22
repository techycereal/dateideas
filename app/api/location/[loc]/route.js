import axios from 'axios'
export async function GET(Request, { params }) {
    const lat = params.loc.split(',')[0]
    const lng = params.loc.split(',')[1]

    const response = await axios.get(`https://us1.locationiq.com/v1/reverse?key=pk.b4041e139eeda896f318f5684ee90e1e&lat=${lat}&lon=${lng}&format=json&`);
    return Response.json({data: response.data});
}
