import { useRef, useState } from "react";
// Importing image assets for icons
import searchIcon from "./assets/Searchicon.png";
import locationIcon from "./assets/Location.png";
import clearWeatherIcon from "./assets/Clear.png";
import rainWeatherIcon from "./assets/Rain.png";
import snowWeatherIcon from "./assets/Snow.png";
import cloudsWeatherIcon from "./assets/Clouds.png";
import hazeWeatherIcon from "./assets/Haze.png";
import smokeWeatherIcon from "./assets/Smoke.png";
import mistWeatherIcon from "./assets/Mist.png";
import drizzleWeatherIcon from "./assets/Drizzle.png";
import notfoundIcon from "./assets/NotFound.png";
import tempIcon from "./assets/temp.png";
import loadIcon from "./assets/loading.png";

// OpenWeather API key
const Api_key = "bdb32feb286db6ce57c0594e34cae586";

const App = () => {
  const inputRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [showWeather, setShowWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const WeatherTypes = [
    { type: "Clear", img: clearWeatherIcon },
    { type: "Rain", img: rainWeatherIcon },
    { type: "Snow", img: snowWeatherIcon },
    { type: "Clouds", img: cloudsWeatherIcon },
    { type: "Haze", img: hazeWeatherIcon },
    { type: "Smoke", img: smokeWeatherIcon },
    { type: "Mist", img: mistWeatherIcon },
    { type: "Drizzle", img: drizzleWeatherIcon },
  ];

  // Timeout function
  const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject('timeout'), ms));

  // Fetch weather by city name with a 1-second timeout
  const fetchWeather = async () => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${inputRef.current.value}&units=metric&appid=${Api_key}`;
    setLoading(true);

    try {
      const res = await Promise.race([
        fetch(URL),
        timeout(1000) // 1 second timeout
      ]);

      const data = await res.json();

      // If data has a 404 or 400 code, show Not Found
      if (data.cod === 404 || data.cod === 400) {
        setShowWeather([{ type: "Not Found", img: notfoundIcon }]);
        setApiData(null);
      } else {
        setShowWeather(
          WeatherTypes.filter((weather) => weather.type === data.weather[0].main)
        );
        setApiData(data);
      }
    } catch (err) {
      if (err === 'timeout') {
        setShowWeather([{ type: "Not Found", img: notfoundIcon }]);
        setApiData(null);
      } else {
        console.log(err);
        setShowWeather([{ type: "Not Found", img: notfoundIcon }]);
        setApiData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get the user's location and fetch weather using coordinates
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to retrieve your location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Fetch weather using latitude and longitude with a 1-second timeout
  const fetchWeatherByCoords = async (lat, lon) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${Api_key}`;
    setLoading(true);

    try {
      const res = await Promise.race([
        fetch(URL),
        timeout(1000) // 1 second timeout
      ]);

      const data = await res.json();

      if (data.cod === 404 || data.cod === 400) {
        setShowWeather([{ type: "Not Found", img: notfoundIcon }]);
        setApiData(null);
      } else {
        setShowWeather(
          WeatherTypes.filter((weather) => weather.type === data.weather[0].main)
        );
        setApiData(data);
      }
    } catch (err) {
      if (err === 'timeout') {
        setShowWeather([{ type: "Not Found", img: notfoundIcon }]);
        setApiData(null);
      } else {
        console.log(err);
        setShowWeather([{ type: "Not Found", img: notfoundIcon }]);
        setApiData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 h-screen grid place-items-center">
      <div className="bg-white w-96 p-4 rounded-md">
        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter City Name"
            className="text-xl border-b p-1 border-gray-200 font-semibold uppercase flex-1"
          />
          <button onClick={fetchWeather}>
            <img src={searchIcon} alt="Search" className="w-8" />
          </button>
          <button onClick={getLocation}>
            <img src={locationIcon} alt="Location" className="w-8" />
          </button>
        </div>
        
        <div className={`duration-300 delay-75 overflow-hidden ${showWeather ? "h-[27rem]" : "h-0"}`}>
          {loading ? (
            <div className="grid place-items-center h-full">
              <img src={loadIcon} alt="Loading" className="w-14 mx-auto mb-2 animate-spin" />
            </div>
          ) : (
            showWeather && (
              <div className="text-center flex flex-col gap-6 mt-10">
                {apiData && (
                  <p className="text-xl font-semibold">
                    {apiData?.name + "," + apiData?.sys?.country}
                  </p>
                )}
                <img src={showWeather[0]?.img} alt="Weather Icon" className="w-52 mx-auto" />
                <h3 className="text-2xl font-bold text-zinc-800">
                  {showWeather[0]?.type}
                </h3>
                {apiData && (
                  <div className="flex justify-center">
                    <img src={tempIcon} alt="Temperature Icon" className="h-9 mt-1" />
                    <h2 className="text-4xl font-extrabold">
                      {apiData?.main?.temp}&#176;C
                    </h2>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
