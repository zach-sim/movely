import React, { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGL, { NavigationControl } from 'react-map-gl';
import mapStyle from './style.json';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { useSelector } from 'react-redux';
import useWindowSize from '@rehooks/window-size';
import {TripsLayer} from '@deck.gl/geo-layers';
import carTripData from './data/cars.json';
import walkTripData from './data/walk.json';
import bicycleTripData from './data/bicycle.json';

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
  zoom: 14,
  pitch: 45,
}

const MaxTime = 12250;
const Map = () => {
  const windowSize = useWindowSize();
  const [viewport, setVp] = useState(initialViewport);
  const geoData = useSelector(state => {
    const { loading, visibleLayers, ...data } = state;
    return data;
  });
  const visibleLayers = useSelector(state => state.visibleLayers);


  const [time, setTime] = useState(1400);
  useAnimationFrame(deltaTime => {
    setTime(prevTime => (prevTime + deltaTime * 0.015) % MaxTime)
  })

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
          {visibleLayers.includes('building') && <GeoJsonLayer
            {...{
              data: geoData.building,
              id: 'buildings',
              opacity: 0.75,
              filled: true,
              stroked: true,
              extruded: true,
              getLineColor: f => [0, 0, 0],
              getFillColor: f => [150, 150, 150],
              lineWidthMinPixels: 1,
              getLineWidth: 10,
              getElevation: building => {
                return building.properties.approx_hei;
              },
            }} />}
          {visibleLayers.includes('car') && <TripsLayer
            {...{
              id: 'trips',
              data: carTripData,
              getPath: d => d.path,
              getTimestamps: d => d.timestamps,
              getColor: d => [245, 185, 66],
              opacity: 0.3,
              widthMinPixels: 5,
              rounded: true,
              trailLength: 30,
              currentTime: time + 10000,
            }}
          />}
          {visibleLayers.includes('bike') && <TripsLayer
            {...{
              id: 'bike',
              data: bicycleTripData,
              getPath: d => d.path,
              getTimestamps: d => d.timestamps,
              getColor: d => [66, 245, 185],
              opacity: 0.3,
              widthMinPixels: 5,
              rounded: true,
              trailLength: 30,
              currentTime: time + 10000,
            }}
          />}
          {visibleLayers.includes('walk') && <TripsLayer
            {...{
              id: 'walk',
              data: walkTripData,
              getPath: d => d.path,
              getTimestamps: d => d.timestamps,
              getColor: d => [185, 66, 245],
              opacity: 0.3,
              widthMinPixels: 5,
              rounded: true,
              trailLength: 30,
              currentTime: time + 10000,
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
