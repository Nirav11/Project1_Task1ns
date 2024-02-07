// Initialize the map
var map = L.map('map').setView([37.0902, -95.7129], 4);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

// Add Esri feature layer for the Forest Boundary
var forestLayer = L.esri.featureLayer({
  url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/MTBS_Polygons_v1/FeatureServer/0',
  onEachFeature: function (feature, layer) {
    var popupContent = "<b>Name:</b> " + feature.properties.FireName + "<br>" +
      "<b>Fire Type:</b> " + feature.properties.FireType + "<br>" +
      "<b>Acres burned:</b> " + feature.properties.Acres;
    layer.bindPopup(popupContent);
  }
}).addTo(map);

// Initialize marker clustering
var markers = L.markerClusterGroup({
  maxClusterRadius: 50,
  spiderfyOnMaxZoom: true,
  disableClusteringAtZoom: 13
});

// Fetching and adding Emergency Operations Centers (EOC) to the marker cluster
fetch('https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Local_Emergency_Operations_Centers_EOC/FeatureServer/0/query?where=1=1&outFields=*&f=geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      var latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
      var popupContent = "<b>Name:</b> " + feature.properties.NAME + "<br>" +
        "<b>Address:</b> " + feature.properties.ADDRESS + "<br>" +
        "<b>Telephone:</b> " + feature.properties.TELEPHONE;
      var marker = L.marker(latlng).bindPopup(popupContent);
      markers.addLayer(marker);
    });
    map.addLayer(markers);
  });

// Adding a geoJSON layer for the US State Boundary
var usstate = L.geoJSON(null, {
  style: function (feature) {
    return {
      fill: false,
      color: 'black',
      weight: 2,
      opacity: 1
    };
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.STATE_NAME);
  }
}).addTo(map);

// Fetching and adding US State Boundary data
fetch('https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Boundaries_2022/FeatureServer/1/query?where=1=1&outFields=*&f=geojson')
  .then(response => response.json())
  .then(data => {
    usstate.addData(data);
  });



// var map = L.map('map').setView([37.0902, -95.7129], 4);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 	subdomains: 'abcd',
// 	minZoom: 0,
// 	maxZoom: 20,
// 	ext: 'png'
// }).addTo(map);


// // Adding Esri feature layer for the Forest Boundary
// var forestLayer = L.esri.featureLayer({
//     url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/MTBS_Polygons_v1/FeatureServer/0',
//     onEachFeature: function (feature, layer) {
//       var popupContent = "<b>Name:</b> " + feature.properties.FireName + "<br>" +
//         "<b>Fire Type:</b> " + feature.properties.FireType + "<br>" +
//         "<b>Acres burned:</b> " + feature.properties.Acres;
//       // Customize pop-up or other feature interactions if needed
//       layer.bindPopup(popupContent);
//     }
//   }).addTo(map);
  
//   // Initialize marker clustering
//   var markers = L.markerClusterGroup({
//     maxClusterRadius: 50,
//     spiderfyOnMaxZoom: true,
//     disableClusteringAtZoom: 13
//     // Additional options can be added as needed
//   });
  
//   // Fetching the Emergency Operations Centers geojson url
//   fetch('https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Local_Emergency_Operations_Centers_EOC/FeatureServer/0/query?where=1=1&outFields=*&f=geojson')
//     .then(response => response.json())
//     .then(data => {
//       // Adding markers to the marker cluster
//       data.features.forEach(feature => {
//         var latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
//         var popupContent = "<b>Name:</b> " + feature.properties.NAME + "<br>" +
//           "<b>Address:</b> " + feature.properties.ADDRESS + "<br>" +
//           "<b>Telephone:</b> " + feature.properties.TELEPHONE;
  
//         var marker = L.marker(latlng, {
//           icon: L.divIcon({
//             className: 'custom-div-icon',
//             html: "<div style='background-color:red;' class='marker-pin'></div>",
//             iconSize: [30, 30],
//             iconAnchor: [15, 30]
//           }),
//         });
  
//         marker.bindPopup(popupContent);
//         markers.addLayer(marker);
//       });
  
//       // Add the markers cluster to the map
//       map.addLayer(markers);
//     });
  
//   // Adding geojson layer for the US State Boundary and showing popup
//   var usstate = L.geoJSON(null, {
//     style: {
//       fill: false,
//       color: 'black',
//       weight: 2,
//       opacity: 1
//     },
//     onEachFeature: function (feature, layer) {
//       // Customize pop-up or other feature interactions if needed
//       layer.bindPopup(feature.properties.STATE_NAME);
//     }
//   }).addTo(map);
  
//   // Fetching the US State Boundary geojson url
//   fetch('https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Boundaries_2022/FeatureServer/1/query?where=1=1&outFields=*&f=geojson')
//     .then(response => response.json())
//     .then(data => {
//       usstate.addData(data);
//     });