import React, { Component } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGL, { NavigationControl } from 'react-map-gl';
import mapStyle from './style.json';
import geoJson from './data/areaUnits.geojson.json';
import buildings from './data/Wellington_Buildings.json';
import DeckGL, { GeoJsonLayer } from 'deck.gl';

class Map extends Component {

  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: -40.9006,
      longitude: 174.886,
      zoom: 5,
      latitude: -41.2865,
      longitude: 174.7762,
      zoom: 14,
      pitch: 45,
    }
  };

  render() {
    return (
      <ReactMapGL
        mapboxApiAccessToken={`pk.eyJ1Ijoic2lsZW5zIiwiYSI6ImNrMDgzZW5kbjA1bGszbWx0b3o0azk1c3AifQ.kVDvhtKEcpo8JcSJ0LB-XQ`}
        mapStyle={mapStyle}
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
        onLoad={(ev) => {
          const map = ev.target;
        }}
      >
        <DeckGL viewState={this.state.viewport}
          layers={[
            new GeoJsonLayer({
              id: 'areas',
              data: geoJson,
              opacity: 0.05,
              filled: true,
              stroked: true,
              getLineColor: f => [0, 0, 0],
              getFillColor: f => [255, 255, 255],
              pickable: true,
              lineWidthMinPixels: 1,
              getLineWidth: 10,
              onClick: (ev) => {
                const { AU_NO, AU_NAME } = ev.object.properties;
                // alert(`${AU_NO}: ${AU_NAME}`);
              }
            }),
            new GeoJsonLayer({
              id: 'buildings',
              data: buildings,
              extruded: true,
              opacity: 0.75,
              filled: true,
              getFillColor: f => [255, 255, 255],
              getElevation: building => {
                return building.properties.approx_hei;
              }
            })
          ]}
        />
        <div style={{position: 'absolute', right: 0}}>
          <NavigationControl />
        </div>
      </ReactMapGL>
    );
  }
}

export default Map;
