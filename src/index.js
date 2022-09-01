import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const failedRes = () => {
  Notify.failure('Oops, there is no country with that name');
};

const toManyCountries = () => {
  Notify.info('Too many matches found. Please enter a more specific name.');
};

const renderManyCountries = countries => {
  const countriesStr = countries
    .map(
      country =>
        `<li class="country-list__item"><img src="${country.flags.svg}" alt="" class="country-list__img">${country.name.official}</li>`
    )
    .join('');
  countryListEl.insertAdjacentHTML('beforeend', countriesStr);
};

const showAboutCountry = countries => {
  const languages = Object.values(countries[0].languages);

  const country = countries[0];
  const countryInfo = `<h2 class="country-info__title"><img src="${
    country.flags.svg
  }" alt="" class="country-info__img">${country.name.official}</h2>
    <p class="country-info__details"><span class="country-info__details--bold">Capital: </span>${
      country.capital
    }</p>
    <p class="country-info__details"><span class="country-info__details--bold">Population: </span>${
      country.population
    }</p>
    <p class="country-info__details"><span class="country-info__details--bold">Languages: </span>${languages
      .map(lang => `${lang}`)
      .join(', ')}</p>`;
  countryInfoEl.insertAdjacentHTML('beforeend', countryInfo);
};

const createRequest = name => {
  fetchCountries(name)
    .then(res => {
      if (res.status !== 200) {
        throw new Error();
      }
      return res.json();
    })
    .then(countries => {
      if (countries.length > 10) {
        toManyCountries();
      }
      if (countries.length >= 2 && countries.length <= 10) {
        renderManyCountries(countries);
      }
      if (countries.length === 1) {
        showAboutCountry(countries);
      }
    })
    .catch(() => failedRes());
};

const onInputChange = evt => {
  const value = evt.target.value.trim();
  if (value === '') return;
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
  createRequest(value);
};

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
