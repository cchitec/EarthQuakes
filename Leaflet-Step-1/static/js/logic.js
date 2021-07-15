url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(queryUrl, function(data) {  
  createFeatures(data.features);
  });

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

var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
};
 // Create overlay object to hold our overlay layer
var overlayMaps = {
    Earthquakes: earthquakes
};

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

function setColor(magnitude){
    switch(true){
        case magnitude>=6:
            return'#800000'
        case magnitude>=5:
            return'#b30000'
        case magnitude>=4:
            return'##ff3300'
        case magnitude>=3:
            return '#ff9900'
        case magnitude>=2:
            return'#ffcc00'
        case magnitude>=1:
            return '#ffff00'
        case magnitude<1:
            return '#ccff33'
    }
};
  
function markerSize(magnitude) {
    return magnitude * 4
};

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

