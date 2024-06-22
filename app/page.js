'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [date, setDate] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [currentGenere, setGenere] = useState([]);
  const [location, setLocation] = useState({ longitude: '0', latitude: '0' });
  const [loading, setLoading] = useState(true);
  const [myErr, setMyErr] = useState('');

  

  const handleError = (err) => {
    setMyErr('Looks like our services could be down refresh the page');
  };

  const giveIdea = async (temp, weather, city, state) => {
    try {
      
      const response = await axios.post('/api/sendprompt', {
        dateIdeaRequest: `return in nothing but JSON format whats a good date idea for ${currentGenere} near/in ${city} ${state} for ${temp} degree weather with ${weather} I want two properties of name (the thing to do) and location and I want 5 of them location max of 4 words`,
      });
      console.log(response)
      setDate(response.data.object);
      setLoading(false);
      
      setLoading(false); 
    } catch (err) {
      handleError(err);
      console.log(err)
    }
  };

  const showPosition = async (position) => {
    try {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const urls = '/api/'+ JSON.stringify(latitude) + ',' +  JSON.stringify(longitude)
      const response = await axios.get(urls)
      setTemperature(response.data.temperature);
      setWeather(response.data.weather);
      const url = '/api/location/'+ JSON.stringify(latitude) + ',' +  JSON.stringify(longitude)
      const getLocation = await axios.get(url)
      const myLocation = getLocation.data.data
      console.log(myLocation)
      setLocation({ state: myLocation.address.state, city: myLocation.address.city });
      console.log('here')
      giveIdea(response.data.temperature, response.data.weather, myLocation.address.state, myLocation.address.city);
    } catch (err) {
      console.log(err)
      handleError(err);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(showPosition);
  }, [currentGenere]);
  const addGenere = (option) => {
    setLoading(true);
    setDate([]);
    setGenere((prev) => [...prev, option])
  };

  function removeGenere(option){
    setGenere((prev) => prev.filter((prevGenere) => prevGenere !== option))
}

  return (
    <div class="bg-yellow-100 min-h-screen flex flex-col items-center justify-center">
      <h1 class="text-4xl font-bold mb-4 text-orange-600">Date Designed</h1>
    <div class="container mx-auto p-6 pt-20 shadow rounded bg-white bg-opacity-50">
      <div class="flex flex-wrap gap-4 mb-4">
        {currentGenere.map((genre, index) => (
          <span
            key={index}
            class="bg-yellow-200 py-2 px-4 rounded text-orange-600 text-lg font-bold cursor-pointer"
          >
            {genre ==
            `Cities/states outside ${location.city} ${location.state} around 100-200 miles` ? (
              'Travel'
            ) : (
              genre
            )}
            <span class='ml-4 text-gray-500 cursor-pointer' onClick={() => removeGenere(genre)}>
              X
            </span>
          </span>
        ))}
      </div>
      <div className='flex inline'>
        <h1 className="text-3xl font-bold mb-4 text-orange-600">The Weather Is {JSON.stringify(temperature).length >= 1 ? JSON.stringify(temperature).slice(0, 2) : ''} Degrees with {weather}</h1>
        <button 
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-auto"
          onClick={() => giveIdea(temperature, weather, location.city, location.state)}
        >
          Reload
        </button>
      </div>
      {loading ? (
        <div class="loading-screen">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(5).fill().map((_, i) => (
              <div key={i} class="bg-yellow-200 shadow p-4 rounded h-44 w-full md:w-64 lg:w-80 xl:w-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {date.length > 0 && (
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {date.map((item) => (
                <div class="bg-orange-200 shadow p-4 rounded" key={item.name}>
                  <h2 class="text-lg font-bold text-orange-600">{item.name}</h2>
                  <p class="text-gray-600">{item.location}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  <div class="bg-orange-200 shadow p-4 rounded max-w-md mx-auto mt-8">
    <h2 class="text-lg font-bold text-orange-600">Date Genres</h2>
    <div class="flex flex-wrap gap-4">
      <button class="bg-yellow-200 py-2 px-4 rounded text-orange-600" onClick={() => addGenere('Romantic')}>Romantic</button>
      <button class="bg-yellow-200 py-2 px-4 rounded text-orange-600" onClick={() => addGenere('Adventure')}>Adventure</button>
      <button class="bg-yellow-200 py-2 px-4 rounded text-orange-600" onClick={() => addGenere('Casual')}>Casual</button>
      <button class="bg-yellow-200 py-2 px-4 rounded text-orange-600" onClick={() => addGenere('Stay at home')}>Stay at home</button>
      <button class="bg-yellow-200 py-2 px-4 rounded text-orange-600" onClick={() => addGenere('Cheap')}>Cheaper</button>
      <button class="bg-yellow-200 py-2 px-4 rounded text-orange-600" onClick={() => addGenere('Expensive')}>Expensive</button>
      <button class="bg-yellow-200 py-2 px-4 rounded text-orange-600" onClick={() => addGenere(`Cities/states outside ${location.city} ${location.state} around 100-200 miles`)}>Travel to near cities</button>
      <button class="bg-yellow-200 py-2 px-4 rounded text-orange-600" onClick={() => addGenere('First Date')}>First Date</button>
    </div>
  </div>
</div>
  );
}

export default App;