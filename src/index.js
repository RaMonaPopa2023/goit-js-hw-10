import axios from 'axios';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';

axios.defaults.headers.common['x-api-key'] =
  'live_HtHfoxYmdRfM59fQEj9nXgQe4i1mc2zQaqEKC2FTCwxz6fbn1q7lTT5wtxO8on6X';

import { fetchBreeds, fetchCatByBreed } from './cat-api';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const catInfo = document.querySelector('.cat-info');
  const errorElement = document.querySelector('.error');

  const slim = new SlimSelect({
    select: breedSelect,
    placeholder: 'Select a value',
  });

  // Function to show the loader
  function showLoader() {
    loader.classList.add('loading');
    breedSelect.style.display = 'none';
  }

  // Function to hide the loader
  function hideLoader() {
    loader.classList.remove('loading');
  }

  // Function to hide the select element and show the loader
  function showSelectLoader() {
    showLoader();
  }

  // Function to show the select element and hide the loader
  function hideSelectLoader() {
    breedSelect.style.display = 'block';
    hideLoader();
  }

  // Function to hide the cat info and show the loader
  function showCatInfoLoader() {
    catInfo.style.display = 'none';
    showLoader();
  }

  // Function to show the cat info and hide the loader
  function hideCatInfoLoader() {
    catInfo.style.display = 'block';
    hideLoader();
  }

  // Function to clear error message
  function clearError() {
    errorElement.textContent = '';
    errorElement.style.display = 'none'; // Hide the error message
  }

  function handleRequestError(error) {
    Notiflix.Notify.Failure(message);
  }

  // Function to show the error message
  function showError(message) {
    Notiflix.Notify.Failure(message);
    errorElement.classList.add('show'); // Add the 'show' class to display the error
  }

  // Function to hide the error message
  function hideError() {
    errorElement.textContent = '';
    errorElement.classList.remove('show'); // Remove the 'show' class to hide the error
  }

  // Fetch breeds and populate the select element
  showSelectLoader();
  fetchBreeds()
    .then(breeds => {
      // Hide the loader and show the select element
      hideSelectLoader();

      // Populate the select element with breed options
      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
      });

      // Populate the Slim Select dropdown with breed options
      const breedOptions = breeds.map(breed => ({
        text: breed.name,
        value: breed.id,
      }));
      slim.setData(breedOptions);
    })
    .catch(error => {
      // Handle and display error
      hideSelectLoader();
      handleRequestError(error);
      showError('Oops! Something went wrong. Try reloading the page.');
    });

  // Add an event listener for the breed select
  breedSelect.addEventListener('change', () => {
    // Clear previous cat information and error message
    catInfo.innerHTML = '';
    clearError();

    const selectedBreedId = breedSelect.value;

    if (selectedBreedId) {
      // Hide the cat info and show the loader
      showCatInfoLoader();

      // Fetch cat information by breed
      fetchCatByBreed(selectedBreedId)
        .then(cat => {
          // Create elements to display cat information
          const catName = document.createElement('h2');
          catName.textContent = cat.breeds[0].name;

          const catDescription = document.createElement('p');
          catDescription.textContent = `Description: ${cat.breeds[0].description}`;

          const catTemperament = document.createElement('p');
          catTemperament.textContent = `Temperament: ${cat.breeds[0].temperament}`;

          const catImage = document.createElement('img');
          catImage.src = cat.url;
          catImage.alt = cat.breeds[0].name;

          // Append cat information to the cat-info div
          catInfo.appendChild(catName);
          catInfo.appendChild(catDescription);
          catInfo.appendChild(catTemperament);
          catInfo.appendChild(catImage);

          // Hide the loader and show the cat info
          hideCatInfoLoader();
        })
        .catch(error => {
          // Handle and display error
          clearError();
          handleRequestError(error);
          // Hide the loader
          hideCatInfoLoader();
          showError(
            'Oops! Something went wrong. Try selecting a different breed.'
          );
        });
    }
  });
});
