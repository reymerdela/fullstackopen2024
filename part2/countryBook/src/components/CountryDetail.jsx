import { useEffect, useMemo, useState } from 'react';
import weatherService from '../services/weatherApi.js';

function CountryDetail({ country }) {
  const [weather, setWeather] = useState({ temp: '', wind: '', icon: null });
  const [lat, lon] = country.latlng;

  useEffect(() => {
    weatherService.getWeather(lat, lon).then((data) => {
      console.log('Weather Service load');
      setWeather({
        temp: data.main.temp,
        wind: data.wind.speed,
        icon: data.weather[0].icon,
      });
    });
  }, [lat, lon]);

  if (!country) {
    return null;
  }

  const languages = country.languages ? Object.values(country.languages) : null;

  return (
    <div>
      <h2>{country.name.common}</h2>
      {country.capital && <p>Capital: {country.capital[0]}</p>}
      <p>
        Area: {country.area} km<sup>2</sup>
      </p>
      {languages && (
        <>
          <h3>Languages: </h3>
          <ul>
            {languages.map((lang) => {
              return <li key={lang}>{lang}</li>;
            })}
          </ul>
        </>
      )}

      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>
        Weather in {country.capital ? country.capital[0] : country.name.common}
      </h2>
      <p>Temperature: {weather.temp} Celcius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt=""
      />
      <p>Wind: {weather.wind} m/s</p>
    </div>
  );
}

export default CountryDetail;
