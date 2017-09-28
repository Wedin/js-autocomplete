/* global Trianglify, autocomplete */
(() => {
  var pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight,
    x_colors: [
      '#8e0152',
      '#c51b7d',
      '#de77ae',
      '#f1b6da',
      '#fde0ef',
      '#f7f7f7',
      '#e6f5d0',
      '#b8e186',
      '#7fbc41',
      '#4d9221',
      '#276419',
    ],
  });
  document.querySelector('.page-wrapper').appendChild(pattern.canvas());

  // const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
  const endpoint = '/cities.json';
  const cities = [];
  fetch(endpoint)
    .then(blob => blob.json())
    .then(data => cities.push(...data));

  autocomplete.init({
    input: '.js-autocomplete',
    autocompleteSearchFunction: searchTerm => {
      const suggestions = [];
      const regex = new RegExp(searchTerm, 'gi');
      cities.forEach(place => {
        if (place.city.match(regex)) {
          suggestions.push(place.city);
        }
        if (place.state.match(regex)) {
          suggestions.push(place.state);
        }
      });
      return suggestions;
    },
  });
})();
