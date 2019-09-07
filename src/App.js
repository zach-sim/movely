import React, { Component } from 'react';
import styled from 'styled-components';
import { FaBuilding, FaCar } from "react-icons/fa";
import './App.css';
import Map from './Map';
import { useSelector, useDispatch } from 'react-redux';

const Nav = styled.nav`
  width: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: end;
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

const App = () => {
  const visibleLayers = useSelector(state => state.visibleLayers);
  const dispatch = useDispatch();
  return (<>
    <Nav>
      <FaCar />
      <FaBuilding
        onClick={() => {
          dispatch({ type: 'TOGGLE_VISIBILITY', name: 'building' });
        }}
        style={{ opacity: visibleLayers.includes('building') ? 1 : 0.25 }}
      />
    </Nav>
    <Map>
    </Map>
  </>);
}

export default App;
