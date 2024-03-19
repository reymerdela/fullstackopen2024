import axios from 'axios';

const BASE_URL = '/api/persons';

const addPerson = (object) => {
  return axios.post(BASE_URL, object).then((response) => response.data);
};

const getAll = () => {
  return axios.get(BASE_URL).then((response) => response.data);
};

const deletePerson = (id) => {
  return axios.delete(`${BASE_URL}/${id}`).then((response) => response.data);
};

const updatePerson = (id, newObject) => {
  return axios
    .put(`${BASE_URL}/${id}`, newObject)
    .then((response) => response.data);
};

export default { addPerson, getAll, deletePerson, updatePerson };
