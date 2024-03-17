const BASE_URL = 'https://studies.cs.helsinki.fi/restcountries/api/name/';
// const BASE_ALL = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const BASE_ALL = '../../db.json';

const getCountryByName = async (name) => {
  try {
    const response = await fetch(`${BASE_URL}/${name}`);
    if (response.status !== 200) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getAll = async () => {
  try {
    const response = await fetch(BASE_ALL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default {
  getCountryByName,
  getAll,
};
