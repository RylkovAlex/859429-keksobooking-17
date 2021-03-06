'use strict';
(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var QUANTITY = 5; // максимальное кол-во отображаемых пинов

  // форма для фильтрации
  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelectorAll('.map__filter');
  // сами фильтры
  var housingType = filtersContainer.querySelector('#housing-type');
  var housingPrice = filtersContainer.querySelector('#housing-price');
  var housingRooms = filtersContainer.querySelector('#housing-rooms');
  var housingGuests = filtersContainer.querySelector('#housing-guests');
  // чекбоксы
  var featuresContainer = filtersContainer.querySelector('#housing-features');
  var featureCheckboxs = featuresContainer.querySelectorAll('.map__checkbox');
  // переменная для хранения фильтрованного массива:
  var adsFilteredData;

  featureCheckboxs.forEach(function (it) {
    it.addEventListener('change', filter);
  });

  filters.forEach(function (it) {
    it.addEventListener('change', filter);
  });

  function filter() {
    // убираю карточку
    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').remove();
    }
    // TODO: подумать как можно оптимизировать эту цепочку фильтрации?
    adsFilteredData = filterData(window.adsDefaultData, housingType.value, 'type');
    adsFilteredData = filterHousingPrice(adsFilteredData, housingPrice.value);
    adsFilteredData = filterData(adsFilteredData, housingRooms.value, 'rooms');
    adsFilteredData = filterData(adsFilteredData, housingGuests.value, 'guests');
    adsFilteredData = filterFeatures(adsFilteredData);

    window.deletePins();
    window.insertPinsFragment(adsFilteredData, QUANTITY);
  }

  function filterData(data, value, offerKey) {
    return (value === 'any') ? data : data.filter(function (it) {
      return (it.offer[offerKey].toString() === value.toString());
    });
  }

  function filterHousingPrice(data, value) {
    var filterCbToValue = {
      'middle': function (it) {
        return (it.offer.price >= LOW_PRICE && it.offer.price <= HIGH_PRICE);
      },
      'low': function (it) {
        return (it.offer.price < LOW_PRICE);
      },
      'high': function (it) {
        return (it.offer.price > HIGH_PRICE);
      }
    };
    return (value === 'any') ? data : data.filter(filterCbToValue[value]);
  }

  function filterFeatures(data) {
    var featureSelectedCheckboxs = Array.from(featureCheckboxs).filter(function (it) {
      return it.checked;
    });
    var selectedValues = featureSelectedCheckboxs.map(function (it) {
      return it.value;
    });
    var filteredData = data.filter(function (it) {
      return (
        selectedValues.every(function (feature) {
          return (it.offer.features.indexOf(feature) >= 0);
        })
      );
    });
    return filteredData;
  }

})();
