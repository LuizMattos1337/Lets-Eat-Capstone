/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Container, InputGroup } from 'react-bootstrap';
import { baseUrl, baseFrontEndUrl } from '../../Shared/baseUrl';
import { useUser } from '../UserProvider/UserProvider';

export default function GuestLinks(props) {
	const [guestLinks, setGuestLinks] = useState([]);
	const user = useUser();

	useEffect(() => {
		/* Effects */
		fetchGuestLinks();
		return () => {
			/* Effects clean up */
		};
	}, []);

	async function fetchGuestLinks() {
		try {
			const fetchUrl = `${baseUrl}/guest/list/${props.eventId}`;
			const authConfig = {
				headers: { Authorization: `Bearer ${user.token}` },
			};
			const fetchedLinks = await axios.get(fetchUrl, authConfig);
			setGuestLinks(fetchedLinks.data);
		} catch (error) {
			console.error(error);
		}
	}

	function renderGuestLinks() {
		if (guestLinks.length !== 0) {
			return guestLinks.map((link, index) => {
				if (index !== 0) {
					return (
						<InputGroup className='mb-1 d-flex' key={link.guestLink}>
							<Button variant='outline-secondary' className='guest-link--label'>
								Link for Guest {link.guestId}
							</Button>
							<InputGroup.Text className='guest-link--link flex-fill'>
								{`${baseFrontEndUrl}/vote/${props.eventId}/${link.guestLink}`}
							</InputGroup.Text>
						</InputGroup>
					);
				}
			});
		} else {
			return <Container>Oops, something went wrong...</Container>;
		}
	}

	return (
		<Container id='guest-links-box d-grid gap-2' style={{ maxWidth: '500px' }}>
			{renderGuestLinks()}
			<pre className='dev-mode'>
				guestLinks:{JSON.stringify(guestLinks, null, 2)}
			</pre>
		</Container>
	);
}
