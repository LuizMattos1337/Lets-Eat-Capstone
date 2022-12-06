import React, { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import '../../index.css';

const UserContext = React.createContext();
const UserUpdateContext = React.createContext();

export function useUser() {
	return useContext(UserContext);
}
export function useUserUpdate() {
	return useContext(UserUpdateContext);
}

export function UserProvider({ children }) {
	const [user, setUser] = useState({
		id: undefined,
		username: '',
		authorities: [],
		token: undefined,
	});

	function deleteUser() {
		const blankUser = {
			id: null,
			username: '',
			authorities: [],
			token: undefined,
		};
		setUser(blankUser);
	}

	function makeUser() {
		const newUser = {
			id: 1,
			username: 'user',
			authorities: [],
			token: 123,
		};
		setUser(newUser);
	}

	/**
	 * Persists the user login credentials into the react context
	 * @param {object} user Object with a username, id, token, and authorities
	 */
	function updateUser(user) {
		setUser(user);
	}

	return (
		<UserContext.Provider value={user}>
			<UserUpdateContext.Provider value={updateUser}>
				{children}
				<div className='dev-mode'>
					<small>Secret context debug menu that won't be shown to users</small>
					<pre>Current context : {JSON.stringify(user, null, 2)}</pre>
					<Button onClick={makeUser}>Log in</Button>
					<Button onClick={deleteUser}>Log out</Button>
					<Button onClick={() => console.log(user)}>Log context</Button>
				</div>
			</UserUpdateContext.Provider>
		</UserContext.Provider>
	);
}
