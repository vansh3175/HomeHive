var map = L.map('map').setView(lisCoordinates,13);

var marker = L.marker(lisCoordinates,).addTo(map);
marker.bindPopup(`<h4> ${listing.title}</h4> `).openPopup();
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



// var marker = L.marker([51.5, -0.09]).addTo(map);

// async function getGeoJSON(address) {
//     const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
//     const data = await response.json();

//     if (data.length === 0) {
//         console.error("No results found");
//         return null;
//     }

//     const { lat, lon } = data[0];

//     return {
//         type: "Feature",
//         geometry: {
//             type: "Point",
//             coordinates: [parseFloat(lon), parseFloat(lat)]
//         },
//         properties: {
//             address: address
//         }
//     };
// }

// Example usage:


