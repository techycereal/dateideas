'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [date, setDate] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [currentGenere, setGenere] = useState([]);
  const [location, setLocation] = useState({ longitude: '0', latitude: '0' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(showPosition);
  }, [currentGenere]);

  const showPosition = async (position) => {
    try {
      const { latitude, longitude } = position.coords;
      const response = await axios.get(`/api/${latitude},${longitude}`);
      setTemperature(response.data.temperature);
      setWeather(response.data.weather);

      const locationResponse = await axios.get(`/api/location/${latitude},${longitude}`);
      const myLocation = locationResponse.data.data;
      setLocation({ state: myLocation.address.state, city: myLocation.address.city });

      giveIdea(response.data.temperature, response.data.weather, myLocation.address.state, myLocation.address.city);
    } catch (err) {
      setError('Looks like our services could be down. Refresh the page.');
      console.log(err);
    }
  };

  const giveIdea = async (temp, weather, city, state) => {
    try {
      const response = await axios.post('/api/sendprompt', {
        dateIdeaRequest: `return in nothing but JSON format whats a good date idea for ${currentGenere} near/in ${city} ${state} for ${temp} degree weather with ${weather} I want two properties of name (the thing to do) and location and I want 4 of them location max of 4 words`,
      });
      setDate(response.data.object);
      setLoading(false);
    } catch (err) {
      setError('Looks like our services could be down. Refresh the page.');
      console.log(err);
    }
  };

  const addGenere = (option) => {
    setLoading(true);
    setDate([]);
    setGenere((prev) => [...prev, option]);
  };

  const removeGenere = (option) => {
    setGenere((prev) => prev.filter((prevGenere) => prevGenere !== option));
  };

  const reloadIdeas = () => {
    giveIdea(temperature, weather, location.city, location.state);
  };

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 min-h-screen flex flex-col items-center justify-center py-10">
      <h1 className="text-5xl font-extrabold mb-6 text-orange-600">Dates Designed</h1>
      <div className="container mx-auto p-8 pt-20 shadow-xl rounded-lg bg-white bg-opacity-90">
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded mb-4">
            {error}
          </div>
        )}
        <div className="flex flex-wrap gap-4 mb-4">
          {currentGenere.map((genre, index) => (
            <span
              key={index}
              className="bg-yellow-300 py-2 px-4 rounded-full text-orange-600 text-lg font-semibold cursor-pointer shadow-md"
              onClick={() => removeGenere(genre)}
            >
              {genre === `Cities/states outside ${location.city} ${location.state} around 100-200 miles` ? 'Travel' : genre}
              <span className="ml-2 text-red-500 font-bold cursor-pointer">
                &times;
              </span>
            </span>
          ))}
        </div>
        <div className="flex items-center mb-6">
          <h2 className="text-3xl font-bold text-orange-600">
            The Weather Is {JSON.stringify(temperature).slice(0, 2)} Degrees with {weather}
          </h2>
          <button 
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full w-32 ml-auto transition duration-300 ease-in-out flex items-center justify-center"
            onClick={reloadIdeas}
          >
            Reload Ideas
          </button>
        </div>
        {loading ? (
          <div className="loading-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(5).fill().map((_, i) => (
                <div key={i} className="bg-yellow-200 shadow-lg p-4 rounded-lg h-44 w-full animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {date.length > 0 && date.map((item) => (
              <div className="bg-orange-200 shadow-lg p-4 rounded-lg" key={item.name}>
                <h3 className="text-xl font-bold text-orange-600">{item.name}</h3>
                <p className="text-gray-600">{item.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-orange-200 shadow-lg p-6 rounded-lg max-w-lg mx-auto mt-8">
        <h4 className="text-xl font-bold text-orange-600 mb-4">Date Genres</h4>
        <div className="flex flex-wrap gap-4">
          {['Romantic', 'Adventure', 'Casual', 'Stay at home', 'Cheap', 'Expensive', 'First Date'].map((genre) => (
            <button
              key={genre}
              className="bg-yellow-300 py-2 px-4 rounded-full text-orange-600 shadow-md"
              onClick={() => addGenere(genre)}
            >
              {genre}
            </button>
          ))}
          <button
            className="bg-yellow-300 py-2 px-4 rounded-full text-orange-600 shadow-md"
            onClick={() => addGenere(`Cities/states outside ${location.city} ${location.state} around 100-200 miles`)}
          >
            Travel to near cities
          </button>
        </div>
      </div>
      <footer className="bg-yellow-100 w-full py-4 mt-8 text-center text-orange-600">
        <p>&copy; 2024 Dates Designed. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
