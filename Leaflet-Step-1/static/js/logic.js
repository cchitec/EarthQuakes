var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Grabbing our GeoJSON data..
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    function setColor(depth){
        switch(true){
            case depth>60:
                return'#800000'
            case depth<=60:
                return'#b30000'
            case depth<50:
                return'##ff3300'
            case depth<40:
                return '#ff9900'
            case depth<30:
                return'#ffcc00'
            case depth<20:
                return '#ffff00'
            case depth<10:
                return '#ccff33'
    }
}

function markerSize(magnitude) {
    return magnitude * 3
}

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onTheLayer: function (earthquakeData, latlng){
            return L.circleMarker(latlng, {

                opacity: 1,
                fillOpacity: 1,
                adius: markerSize(earthquakeData.properties.mag),
                color: "gray",
                weight: 1,
                fillColor: markerColor(earthquakeData.geometry.coordinates[2]),
                stroke: true,
    
            });
        },
        onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
  

// Add a tile layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});
// darkmap
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});


// baseMaps object
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,

};

 //  overlayMaps object 
 var overlayMaps = {
    Earthquakes: earthquakes
};

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend'),
            magnitude = [0, 1, 2, 3, 4, 5, 6],
            labels = [];
        // loop through our magnitude 
        div.innerHTML ='<div><b>Earthquake <br/> Magnitude</b></div';
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML += '<i style= "background:' + setColor(magnitude[i]) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
  }