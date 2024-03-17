const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?`;

const getWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}lat=${lat}&lon=${lon}&units=metric&appid=${
        import.meta.env.VITE_WEATHER_API
      }`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default {
  getWeather,
};
