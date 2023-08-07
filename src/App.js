import React, { Component } from 'react';
import Main from './components/MainComponent';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import { HelmetProvider } from 'react-helmet-async';

const store = ConfigureStore();

class App extends Component{	
	render() {
		return (
			<HelmetProvider>
			<Provider store={store}>
			<BrowserRouter>
			<div className="App">
			<Main />
			</div>
			</BrowserRouter>
			</Provider>
			</HelmetProvider>
			);
	}
}

export default App;