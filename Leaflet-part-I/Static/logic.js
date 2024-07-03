
// Get the URL of the chosen earthquake dataset in JSON format
let data_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create map object
let myMap = L.map('map').setView([37.0902, -95.7129], 5);  // Centered on the US, adjust zoom as needed

// Adding tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Getting GeoJSON Data
d3.json(data_url).then(function(data) {
    console.log("Map data received successfully!");
    data = data.features;

    // Get magnitude & depth data
    for (let i = 0; i < data.length; i++) {
        let earthquake = data[i];
        let magnitude = earthquake.properties.mag;
        let depth = earthquake.geometry.coordinates[2];

        // Marker size based on magnitude (larger magnitude = larger marker)
        let markerSize = magnitude * 2.5;

        // Function to determine marker color by depth
        function chooseColor(depth) {
            if (depth < 10) return "limegreen";
            else if (depth < 30) return "greenyellow";
            else if (depth < 50) return "yellow";
            else if (depth < 70) return "orange";
            else if (depth < 90) return "orangered";
            else return "red";
            
        }
        
        // Create a circle marker 
        L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            radius: markerSize,
            fillColor: chooseColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`<strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}`).addTo(myMap);
    }

    // Setting up the legend
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    // Legend content
    let legendInfo = "<h3>Earthquake Depth</h3>";
    let depthRanges = ['10', '30', '50', '70', '90', '110'];
    let colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];

    // Generate legend labels looping through density intervals
    for (let i = 0; i < depthRanges.length; i++) {
        let range = depthRanges[i] + (i < depthRanges.length - 1 ? '&ndash;' + depthRanges[i + 1] : '+');
        div.innerHTML += '<div><div class="legend-color" style="background:' + colors[i] + '"></div><div class="legend-text">' + range + '</div></div>';
    }
    
    return div;
};

// Add legend to map
legend.addTo(myMap);

})