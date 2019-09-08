import React, { Component } from 'react';
import styled from 'styled-components';
import { FaBuilding, FaCar, FaWalking, FaBicycle, FaParking } from "react-icons/fa";
import './App.css';
import Map from './Map';
import { useSelector, useDispatch } from 'react-redux';
import mapColours from './colours';

const Nav = styled.nav`
  width: 4rem;
  display: flex;
  flex-direction: column;
  background-color: #353b43;
  height: 100vh;
  font-size: 2em;

  & > span {
    font-size: 1.25rem;
  }
  & > * {
    margin: 0.5em auto;
    color: #afbac4;
    opacity: 0.25;

    &:hover {
      opacity: 0.75;
      cursor: pointer;
    }
  }
`;

const Spacer = styled.span`
  flex: 1;
`;

const App = () => {
  const visibleLayers = useSelector(state => state.visibleLayers);
  const availableLayers = useSelector(state => {
    const { loading, visibleLayers, ...data } = state;
    return Object.keys(data);
  })
  const future = useSelector(state => state.future);
  const dispatch = useDispatch();
  return (<>
    <Nav>
      <span style={{ opacity: !future ? 1 : 0.25 }} onClick={() => dispatch({ type: 'FUTURE_OFF' })}>
        Now
      </span>
      <span style={{ opacity: future ? 1 : 0.25 }} onClick={() => dispatch({ type: 'FUTURE_ON' })}>
        2043
      </span>
      <Spacer />
      <FaWalking
        onClick={() => {
          dispatch({ type: 'TOGGLE_VISIBILITY', name: 'walk' });
        }}
        style={{
          color: visibleLayers.includes('walk') ? `rgb(${mapColours.walk.join(',')})` : '#afbac4',
          opacity: visibleLayers.includes('walk') ? 1 : 0.25,
        }}
      />
      <FaBicycle
        onClick={() => {
          dispatch({ type: 'TOGGLE_VISIBILITY', name: 'bike' });
        }}
        style={{
          color: visibleLayers.includes('bike') ? `rgb(${mapColours.bike.join(',')})` : '#afbac4',
          opacity: visibleLayers.includes('bike') ? 1 : 0.25,
        }}
      />
      <FaCar
        onClick={() => {
          dispatch({ type: 'TOGGLE_VISIBILITY', name: 'car' });
        }}
        style={{
          color: visibleLayers.includes('car') ? `rgb(${mapColours.car.join(',')})` : '#afbac4',
          opacity: visibleLayers.includes('car') ? 1 : 0.25,
        }}
      />
      <Spacer />
      {availableLayers.includes('carParks') && <FaParking
        onClick={() => {
          dispatch({ type: 'TOGGLE_VISIBILITY', name: 'carParks' });
        }}
        title={`${visibleLayers.includes('carParks') ? 'Remove' : 'Add'} the car park overlay`}
        style={{ opacity: visibleLayers.includes('carParks') ? 1 : 0.25 }}
      />}
      {availableLayers.includes('building') && <FaBuilding
        onClick={() => {
          dispatch({ type: 'TOGGLE_VISIBILITY', name: 'building' });
        }}
        title={`${visibleLayers.includes('building') ? 'Remove' : 'Add'} the high detail building overlay`}
        style={{ opacity: visibleLayers.includes('building') ? 1 : 0.25 }}
      />}
    </Nav>
    <Map>
    </Map>
  </>);
}

export default App;
