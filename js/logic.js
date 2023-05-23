// Function to create the map and add earthquake markers
function createMap(earthquakeData) {
    // Create the map centered around (0, 0)
    const map = L.map("map").setView([0, 0], 2);
  
    // Add the tile layer to the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);
  
    // Function to determine the marker size based on magnitude
    function getMarkerSize(magnitude) {
      return magnitude * 5; // Adjust the multiplier as needed for better visualization
    }
  
    // Function to determine the marker color based on depth
    function getMarkerColor(depth) {
      if (depth < 10) {
        return "#00FF00"; // Green
      } else if (depth < 30) {
        return "#FFFF00"; // Yellow
      } else if (depth < 50) {
        return "#FFA500"; // Orange
      } else {
        return "#FF0000"; // Red
      }
    }
  
    // Function to create the marker style based on magnitude and depth
    function createMarkerStyle(feature) {
      const magnitude = feature.properties.mag;
      const depth = feature.geometry.coordinates[2];
      const markerSize = getMarkerSize(magnitude);
      const markerColor = getMarkerColor(depth);
  
      return {
        radius: markerSize,
        fillColor: markerColor,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
    }
  
    // Create a GeoJSON layer with the earthquake data
    L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, createMarkerStyle(feature));
      },
      onEachFeature: function (feature, layer) {
        // Add popup with information about the earthquake
        layer.bindPopup(
          `<h3>${feature.properties.place}</h3><hr>
          <p>Magnitude: ${feature.properties.mag}</p>
          <p>Depth: ${feature.geometry.coordinates[2]}</p>`
        );
      }
    }).addTo(map);
  }
  
  // Fetch earthquake data
  fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      createMap(data);
    });