import React from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./Components/Main/Main";
import './index.css';
import './styles.css';

export default function TempApp(props) {
	return (
		<>
			<BrowserRouter>
				<Main />
			</BrowserRouter>
		</>
	);
}
