import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { decode } from 'geobuf';
import Pbf from 'pbf';

const rootReducer = (
  state = {
    loading: 0,
    visibleLayers: [],
  }, action) => {
    switch(action.type) {
      case 'ADD_PLACEHOLDER_DATA':
        return {
          ...state,
          loading: state.loading + 1,
          [action.name]: { type: 'FeatureCollection', features: [] },
        };
      case 'ADD_DATA':
        return {
          ...state,
          loading: state.loading - 1,
          // visibleLayers: [
          //   ...state.visibleLayers,
          //   action.name,
          // ],
          [action.name]: action.data,
        };
      case 'TOGGLE_VISIBILITY':
        const isVisible = state.visibleLayers.includes(action.name);
        if (isVisible) {
          return {
            ...state,
            visibleLayers: state.visibleLayers.filter(d => d !== action.name)
          }
        } else {
          return {
            ...state,
            visibleLayers: [
              ...state.visibleLayers,
              action.name,
            ]
          }
        }
      default:
        return state;
    }
  }
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
const importDataAction = (name, importFn) => (dispatch) => {
  dispatch({ type: 'ADD_PLACEHOLDER_DATA', name });
  importFn().then(res => {
    return fetch(res.default);
  }).then(res => res.arrayBuffer()).then(data => {
    return decode(new Pbf(data));
  }).then(data => {
    dispatch({
      type: 'ADD_DATA',
      name,
      data,
    })
  })
}
store.dispatch(importDataAction('building', () => import('./data/wgtnBuildings.geobuf')))
// store.dispatch(importDataAction('area', () => import('./data/areaUnits.geobuf')))

ReactDOM.render(
  <Provider {...{ store }}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
