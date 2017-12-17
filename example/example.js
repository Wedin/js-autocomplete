/* global Trianglify, autocomplete, screen */

(() => {
  function setupAutoComplete() {
    const endpoint = '/cities.json';
    const cities = [];
    fetch(endpoint)
      .then(blob => blob.json())
      .then(data => cities.push(...data));

    autocomplete.init({
      input: '.js-autocomplete',
      autocompleteSearchFunction: searchTerm => {
        const regex = new RegExp(searchTerm, 'gi');
        const suggestions = cities.filter(place => {
          return place.city.match(regex) || place.state.match(regex);
        });
        return suggestions;
      },
      displayFunction: item => `${item.city}, ${item.state}`, // not required
      handleSubmit: item => console.log(item),
    });
  }

  function setupTrianglify() {
    var pattern = Trianglify({
      width: screen.width,
      height: screen.height,
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
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupTrianglify();
    setupAutoComplete();
  });
})();
