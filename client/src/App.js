import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TagSelection from './pages/TagSelection';
import './styles/global.css';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route exact path='/' element={<HomePage />}></Route>
				<Route exact path='/tags' element={<TagSelection />}></Route>
				<Route path='*' element={<HomePage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
