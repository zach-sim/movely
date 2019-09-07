import React, { Component } from 'react';
import styled from 'styled-components';
import { FaBuilding, FaCar, FaWalking, FaBicycle } from "react-icons/fa";
import './App.css';
import Map from './Map';
import { useSelector, useDispatch } from 'react-redux';

const Nav = styled.nav`
  width: 4rem;
  display: flex;
  flex-direction: column;
  background-color: #353b43;
  height: 100vh;
  font-size: 2em;

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
  const dispatch = useDispatch();
  return (<>
    <Nav>
      <Spacer />
      <FaWalking
        onClick={() => {
          dispatch({ type: 'TOGGLE_VISIBILITY', name: 'walk' });
        }}
        style={{ opacity: visibleLayers.includes('walk') ? 1 : 0.25 }}
      />
      <FaBicycle
        onClick={() => {
          dispatch({ type: 'TOGGLE_VISIBILITY', name: 'bike' });
        }}
        style={{ opacity: visibleLayers.includes('bike') ? 1 : 0.25 }}
      />
      <FaCar
        onClick={() => {
          dispatch({ type: 'TOGGLE_VISIBILITY', name: 'car' });
        }}
        style={{ opacity: visibleLayers.includes('car') ? 1 : 0.25 }}
      />
      <Spacer />
      {availableLayers.includes('building') && <FaBuilding
        onClick={() => {
          dispatch({ type: 'TOGGLE_VISIBILITY', name: 'building' });
        }}
        style={{ opacity: visibleLayers.includes('building') ? 1 : 0.25 }}
      />}
    </Nav>
    <Map>
    </Map>
  </>);
}

export default App;
