let marker=null;
export function amapSetMarker(lnglat,map){
  if(marker){
    map.remove(marker);
  }
  marker = new AMap.Marker();
  marker.setPosition([lnglat.lng,lnglat.lat]);
  map.add(marker);
  map.setFitView(marker);
}
export function amapClearMarker(map){
  if(marker) {
      map.remove(marker);
      marker = null;
  }
}