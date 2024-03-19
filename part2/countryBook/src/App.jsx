import { useEffect, useState } from 'react';
import countryService from './services/countriesApi';
import CountryDetail from './components/CountryDetail';
import Country from './components/Country';

function App() {
  const [filter, setFilter] = useState('');
  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    countryService.getAll().then((data) => {
      console.log('Country service Load');

      setCountries(data.map((d) => d));
      setLoading(false);
    });
  }, []);

  const handleChange = ({ target: { value } }) => {
    setFilter(value);
    setCountriesToShow(
      countries.filter((country) => {
        return country.name.common.toLowerCase().includes(value.toLowerCase());
      })
    );
  };

  // let countriesToShow = countries.filter((country) => {
  //   return country.name.common.toLowerCase().includes(filter.toLowerCase());
  // });
  if (isLoading) {
    return <h4>Cargando....</h4>;
  }

  return (
    <div>
      <label htmlFor="country">Find countries </label>
      <input type="text" id="country" value={filter} onChange={handleChange} />
      <div>
        {/* {countriesToShow &&
          countriesToShow.map((name) => <p key={name}>{name}</p>)} */}
        {countriesToShow.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countriesToShow.length > 1 ? (
          countriesToShow.map((country) => (
            <Country
              key={country.name.common}
              name={country.name.common}
              onClick={() => setCountriesToShow([country])}
            />
          ))
        ) : (
          countriesToShow.length === 1 && (
            <CountryDetail country={countriesToShow[0]} />
          )
        )}
      </div>
    </div>
  );
}

export default App;
