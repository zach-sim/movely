import React, { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGL, { NavigationControl } from 'react-map-gl';
import mapStyle from './style.json';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { useSelector } from 'react-redux';
import useWindowSize from '@rehooks/window-size';
import {TripsLayer} from '@deck.gl/geo-layers';
import allTripData from './data/2013tripData.js';
import futureTripData from './data/2043tripData.js';
import mapColours from './colours';

const useAnimationFrame = callback => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();

  const animate = time => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime)
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
}

const initialViewport = {
  latitude: -40.9006,
  longitude: 174.886,
  zoom: 5,
  latitude: -41.2865,
  longitude: 174.7762,
  zoom: 15,
  pitch: 45,
}

const StartTime = 7.5 * 60 * 60; // 7:30 in seconds
const MaxTime = 9 * 60 * 60; // 9:00 in seconds

const Map = () => {
  const windowSize = useWindowSize();
  const [viewport, setVp] = useState(initialViewport);
  const geoData = useSelector(state => {
    const { loading, visibleLayers, ...data } = state;
    return data;
  });
  const visibleLayers = useSelector(state => state.visibleLayers);
  window.geoData = geoData;


  const [time, setTime] = useState(0);
  useAnimationFrame(deltaTime => {
    setTime(prevTime => (prevTime + deltaTime * 0.005) % (MaxTime - StartTime))
  })

  const future = useSelector(state => state.future);
  const tripData = future ? futureTripData : allTripData;

  return (
    <ReactMapGL
      mapboxApiAccessToken={`pk.eyJ1Ijoic2lsZW5zIiwiYSI6ImNrMDgzZW5kbjA1bGszbWx0b3o0azk1c3AifQ.kVDvhtKEcpo8JcSJ0LB-XQ`}
      {...{
        width: windowSize.innerWidth,
        height: windowSize.innerHeight,
        ...viewport,
        onViewportChange: ({ width, height, ...vp }) => setVp(vp),
        mapStyle,
      }}
      onLoad={(ev) => {
        const map = ev.target;

        // map.addLayer({
        //   'id': '3d-buildings',
        //   "source": "mapbox",
        //   "source-layer": "building",
        //   'filter': ['==', 'extrude', 'true'],
        //   'type': 'fill-extrusion',
        //   'minzoom': 10,
        //   'paint': {
        //   'fill-extrusion-color': '#aaa',
        //
        //   // use an 'interpolate' expression to add a smooth transition effect to the
        //   // buildings as the user zooms in
        //   'fill-extrusion-height': [
        //   "interpolate", ["linear"], ["zoom"],
        //   10, 0,
        //   10.05, ["get", "height"]
        //   ],
        //   'fill-extrusion-base': [
        //   "interpolate", ["linear"], ["zoom"],
        //   10, 0,
        //   10.05, ["get", "min_height"]
        //   ],
        //   'fill-extrusion-opacity': .6
        //   }
        //   });
      }}
    >
      <DeckGL viewState={{
        width: windowSize.innerWidth,
        height: windowSize.innerHeight,
        ...viewport,
      }}>
        {geoData.area && <GeoJsonLayer
          {...{
            data: geoData.area,
            id: 'areas',
            opacity: 0.05,
            filled: true,
            stroked: true,
            getLineColor: f => [0, 0, 0],
            getFillColor: f => [255, 255, 255],
            lineWidthMinPixels: 1,
            getLineWidth: 10,
          }} />}
          {visibleLayers.includes('carParks') && <GeoJsonLayer
            {...{
              data: geoData.carParks,
              id: 'carParks',
              opacity: 0.5,
              filled: true,
              stroked: true,
              getLineColor: f => [200, 200, 200],
              lineWidthMinPixels: 1,
              getLineWidth: 5,
            }} />}
          {visibleLayers.includes('building') && <GeoJsonLayer
            {...{
              data: geoData.building,
              id: 'buildings',
              opacity: 0.0250,
              filled: true,
              stroked: true,
              extruded: true,
              wireframe: true,
              getLineColor: f => [100, 100, 100],
              getFillColor: f => [150, 150, 150],
              lineWidthMinPixels: 1,
              getLineWidth: 3,
              getElevation: building => {
                return building.properties.approx_hei;
              },
            }} />}
          {visibleLayers.includes('car') && <TripsLayer
            {...{
              id: 'trips',
              data: tripData.car,
              getPath: d => d.path,
              getTimestamps: d => d.timestamps,
              getColor: d => mapColours.car,
              opacity: 1,
              widthMinPixels: 4,
              rounded: true,
              trailLength: 3,
              currentTime: time + StartTime,
            }}
          />}
          {visibleLayers.includes('bike') && <TripsLayer
            {...{
              id: 'bike',
              data: tripData.bicycle,
              getPath: d => d.path,
              getTimestamps: d => d.timestamps,
              getColor: d => mapColours.bike,
              opacity: 1,
              widthMinPixels: 4,
              rounded: true,
              trailLength: 7,
              currentTime: time + StartTime,
            }}
          />}
          {visibleLayers.includes('walk') && <TripsLayer
            {...{
              id: 'walk',
              data: tripData.walk,
              getPath: d => d.path,
              getTimestamps: d => d.timestamps,
              getColor: d => mapColours.walk,
              opacity: 1,
              widthMinPixels: 4,
              rounded: true,
              trailLength: 10,
              currentTime: time + StartTime,
            }}
          />}
      </DeckGL>
      <div style={{position: 'absolute', right: '0.5rem', top: '0.5rem'}}>
        <NavigationControl />
      </div>
    </ReactMapGL>
  )
}

export default Map;
