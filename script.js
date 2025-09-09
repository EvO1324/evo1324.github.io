document.addEventListener('DOMContentLoaded', () => {
  const fetchAirports = async () => {
    try {
      const response = await fetch('airports.json');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      const groupedAirports = groupByCountry(data);
      const normalizeName = (name) => {
        return name.replace(/[^\w\s]/gi, '').trim().toUpperCase();
      };

      for (const country in groupedAirports) {
        groupedAirports[country].sort((a, b) => {
          const nameA = normalizeName(a.name);
          const nameB = normalizeName(b.name);
          return nameA.localeCompare(nameB);
        });
      }

      const sortedCountries = Object.keys(groupedAirports).sort();

      let totalAirports = 0; 

      sortedCountries.forEach(country => {
        groupedAirports[country].forEach(airport => {
          if (airport.icao) {
            totalAirports++; 
          }
        });
      });

      console.log(`Total airports: ${totalAirports}`);  
      const h1Element = document.querySelector('h1');
      h1Element.textContent = `Airport List (${totalAirports}) - 25.1`;

      const airportListContainer = document.getElementById('airport-list');

      airportListContainer.innerHTML = '';

      sortedCountries.forEach(country => {
        console.log(`Country: ${country}`);
        
        const countrySection = document.createElement('div');
        countrySection.className = 'country-section';
        countrySection.textContent = country;

        const airportList = document.createElement('div');
        airportList.className = 'airport-list';
        groupedAirports[country].forEach(airport => {
          console.log(`  Airport: ${airport.name}`);
          
          const airportItem = document.createElement('div');
          airportItem.className = 'airport-item';

          let airportInfo = `
            <strong>${airport.name}</strong> (${airport.icao})<br>
          `;

          if (airport.iata && airport.iata !== 'null') {
            airportInfo = `
              <strong>${airport.name}</strong> (${airport.icao} / ${airport.iata})<br>
            `;
          }

          airportItem.innerHTML = airportInfo;
          airportList.appendChild(airportItem);
        });

        countrySection.addEventListener('click', () => {
          const isVisible = airportList.style.display === 'block';
          airportList.style.display = isVisible ? 'none' : 'block';
        });

        airportListContainer.appendChild(countrySection);
        airportListContainer.appendChild(airportList);
      });
    } catch (error) {
      console.error('Error fetching or parsing data:', error);
    }
  };

  const groupByCountry = (airports) => {
    return airports.reduce((groups, airport) => {
      const countryName = airport.country && airport.country.name ? airport.country.name : 'Unknown';
      
      if (!groups[countryName]) {
        groups[countryName] = [];
      }
      groups[countryName].push(airport);
      return groups;
    }, {});
  };

  fetchAirports();
});
