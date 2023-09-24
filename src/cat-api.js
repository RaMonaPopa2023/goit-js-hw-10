import axios from 'axios';
axios.defaults.headers.common['x-api-key'] =
  'live_HtHfoxYmdRfM59fQEj9nXgQe4i1mc2zQaqEKC2FTCwxz6fbn1q7lTT5wtxO8on6X';

export function fetchBreeds() {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error('Failed to fetch breeds: ' + error.message);
    });
}

export function fetchCatByBreed(breedId) {
  const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;
  return axios
    .get(url)
    .then(response => {
      return response.data[0];
    })
    .catch(error => {
      throw new Error('Failed to fetch cat by breed: ' + error.message);
    });
}
