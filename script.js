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

// Define a custom icon
var lightRedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Initialize marker clustering
var markers = L.markerClusterGroup();

// Fetching and adding Emergency Operations Centers (EOC) to the marker cluster with the new icon
fetch('https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Local_Emergency_Operations_Centers_EOC/FeatureServer/0/query?where=1=1&outFields=*&f=geojson')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            var latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
            var popupContent = "<b>Name:</b> " + feature.properties.NAME + "<br>" +
                "<b>Address:</b> " + feature.properties.ADDRESS + "<br>" +
                "<b>Telephone:</b> " + feature.properties.TELEPHONE;
            var marker = L.marker(latlng, {icon: lightRedIcon}).bindPopup(popupContent);
            markers.addLayer(marker);
        });
        map.addLayer(markers);
    });

// Adding Esri feature layer for the Forest Boundary
var forestLayer = L.esri.featureLayer({
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/MTBS_Polygons_v1/FeatureServer/0',
    onEachFeature: function (feature, layer) {
        var popupContent = "<b>Name:</b> " + feature.properties.FireName + "<br>" +
            "<b>Fire Type:</b> " + feature.properties.FireType + "<br>" +
            "<b>Acres burned:</b> " + feature.properties.Acres;
        layer.bindPopup(popupContent);
    }
}).addTo(map);

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
