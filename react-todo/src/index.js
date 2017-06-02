import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
// import './index.css';
// const io = require('socket.io-client') 
// const server = io('http://localhost:3003/');


// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();


// import React from "react";
// import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'

import reducer from './reducers/reducer'
// import Layout from "./components/Layout";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const app = document.getElementById('root')

const store = createStore(reducer, applyMiddleware(thunk))

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider>	
			<App/>
		</MuiThemeProvider>
	</Provider>
	, app);