var map = L.map('map').setView([50.087465, 14.421254],3)


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    minZoom:2,
    attribution: '© OpenStreetMap',
    zoomAnimation: false,
}).addTo(map);

var southWest = L.latLng(-89.98155760646617, -180),
northEast = L.latLng(89.99346179538875, 180);
var bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});


afterLoad()
locations = []
markers = []
function afterLoad(){
  window.api.receive("fromMain_jslo", (data) => {

    locations = []
    tasks_raw_data.forEach(element => {
      locations.push([element.name, element.coordinates[0], element.coordinates[1]])
    });
    if(markers.length != 0){
      markers.forEach(element => {
        element.remove()
      });

      for (var i = 0; i < locations.length; i++) {
        markers[i] = L.marker([locations[i][1]+laM, locations[i][2]+leM])
          .bindPopup(locations[i][0])
          .addTo(map);
      }
    }
    else if(markers.length == 0){
      for (var i = 0; i < locations.length; i++) {
        markers[i] = L.marker([locations[i][1]+laM, locations[i][2]+leM], {riseOnHover: true})
          .bindPopup(locations[i][0])
          .addTo(map);
        
          /*var circleCenter = [40.72, -74.00];
          var circleOptions = {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0
          }
          var circle = L.circle(circleCenter, 50000, circleOptions);
          circle.addTo(map);*/
      }
    }
    
  })
}





var popup = L.popup();
//počáteční zoom je na 3
la = +3.8, le = -5.8
laM = -2.4, leM = +3.4
/*
function onMapClick(e) {
  ll={"lat":e.latlng.lat + la,"lng":e.latlng.lng + le}
  console.log(ll, map.getZoom())
    popup
        .setLatLng(ll)
        .setContent("lat:"+e.latlng.lat +"lng:"+e.latlng.lng)
        .openOn(map);
        
}

map.on('click', onMapClick);

map.on('', function() {
  
})*/



map.on('zoomend', function() {
  markers.forEach(element => {
    element.remove()
  });
  switch(map.getZoom()) {
    case 2:
      la = +5.12, le = -10.24//pro proklik
      laM = -4.6, leM = +7
      break;
    case 3:
      la = +2.56, le = -5.12//pro proklik
      laM = -2.4, leM = +3.4
      break;
    case 4:
      la = +1.28, le = -2.56//pro proklik
      laM = -1.4, leM = +1.65
      break;
    case 5:
      la = +0.64, le = -1.28//pro proklik
      laM = -0.6, leM = +0.9
      break;


    case 6:
      la = +0.32, le = -0.64//pro proklik
      laM = -0.28, leM = +0.43
      break;
    case 7:
      la = +0.16, le = -0.32//pro proklik
      laM = -0.15, leM = +0.23
      break;
    case 8:
      la = +0.08, le = -0.16//pro proklik
      laM = -0.085, leM = +0.1
      break;
    case 9:
      la = +0.04, le = -0.08//pro proklik
      laM = -0.04, leM = +0.055
      break;
    case 10:
      la = +0.02, le = -0.04//pro proklik
      laM = -0.02, leM = +0.03
      break;
  }
  for (var i = 0; i < locations.length; i++) {
    markers[i] = L.marker([locations[i][1]+laM, locations[i][2]+leM])
      .bindPopup(locations[i][0])
      .addTo(map);
  }
  console.log(la,le, 5.12/Math.pow(2,map.getZoom()-2),10.24/Math.pow(2,map.getZoom()-2),map.getZoom())
});

