import React, { useState } from 'react';
import { Button, Container, FloatingLabel, Form, Modal } from 'react-bootstrap';
import './newEvent.css';
import { baseUrl } from '../../Shared/baseUrl';
import { useUser } from '../UserProvider/UserProvider';
import axios from 'axios';
import GuestLinks from '../GuestLinks/GuestLinks';

export default function NewEvent(props) {
	const [formData, setFormData] = useState({
		eventName: '',
		eventDateTime: '',
		decisionDateTime: '',
		zipCode: 11111,
		numberOfGuests: 2,
		finalChoiceId: 0,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showError, setShowError] = useState(false);
	const [isEventCreated, setIsEventCreated] = useState(false);
	const [event, setEvent] = useState(null);
	const [areGuestLinksCreated, setAreGuestLinksCreated] = useState(false);
	const user = useUser();
	const authConfig = {
		headers: { Authorization: `Bearer ${user.token}` },
	};

	function handleFormChange(event) {
		setFormData((prevData) => ({
			...prevData,
			[event.target.id]: event.target.value,
			userId: user.id,
		}));
	}

	/**
	 * If form data is successfully validated, submits the request to
	 *  create the event
	 * @param {*} event
	 */
	async function handleFormSubmit(event) {
		event.preventDefault();
		if (validateForm()) {
			setIsLoading(true);
			try {
				await createEvent();
			} catch (error) {}
			setIsLoading(false);
		} else {
		}
	}
	/**
	 * Checks form data for validation criteria
	 * @returns {boolean} Indicates whether or not formData is valid
	 */
	function validateForm() {
		const { eventName, eventDateTime, decisionDateTime } = formData;

		/**
		 * Validates eventName based on minimum character length
		 * @returns {boolean}
		 */
		function validateEventName() {
			if (eventName.length < 5) {
				console.error(`Event name is too short`);
				return false;
			}
			return true;
		}

		/**
		 * Validates eventDate has been selected and is in future
		 * @returns {boolean}
		 */
		function validateEventDateTime() {
			if (!eventDateTime) {
				console.error(`Event date not selected`);
				return false;
			}
			const eventAsDate = new Date(eventDateTime);
			const now = new Date();
			if (eventAsDate < now) {
				console.error(`Invalid event date: `, eventAsDate);
				console.error(`Event date/time must be in future`);
				return false;
			}

			`Event Date valid`;
			return true;
		}

		/**
		 * Validates decisionDeadline has been selected and is
		 * before eventDate
		 * @returns {boolean}
		 */
		function validateDecisionDeadline() {
			if (!decisionDateTime) {
				console.error(`Decision date not selected`);
				return false;
			}

			const deadLineDate = new Date(decisionDateTime);
			const eventDate = new Date(eventDateTime);
			const now = new Date();
			`event date `, eventDate, `deadline date `, deadLineDate;
			if (eventDate < deadLineDate || deadLineDate < now) {
				console.error(
					`Deadline of: (${deadLineDate}) must be after event date ${eventDateTime}`
				);
				return false;
			}

			console.log(`Decision date valid`);
			return true;
		}

		console.groupCollapsed(`Running form validation...`);
		if (
			validateEventName() &&
			validateEventDateTime() &&
			validateDecisionDeadline()
		) {
			console.groupEnd(`valid form`);
			return true;
		} else {
			console.error(`Validation failed`);
			setShowError(true);
			console.groupEnd(`End validation`);
			return false;
		}
	}

	async function createEvent() {
		console.groupCollapsed(`createEvent()`);
		try {
			console.log(`try creating event`);

			// Step1: Create the event
			console.log(`Step1: create event`);
			const createEventUrl = `${baseUrl}/event`;
			const createdEvent = await axios.post(
				createEventUrl,
				formData,
				authConfig
			);
			console.log(`response for creating event`, createdEvent);
			setEvent(createdEvent.data);

			// Step2: Return rests by zip
			console.log(`Step2: Get restaurants by zipcode`);
			const fetchRestsUrl = `${baseUrl}/restaurant/zipcode/${createdEvent.data.zipCode}`;
			const restaurantList = await axios.get(fetchRestsUrl, authConfig);
			console.log(`response for getting rests:`, restaurantList);

			// Step3: Create event_restaurant rows
			console.groupCollapsed(`Step3: create event_restaurant rows`);
			const createEventRestRowUrl = `${baseUrl}/voting`;
			for (const rest of restaurantList.data) {
				const restRowBody = {
					eventId: createdEvent.data.eventId,
					restaurantId: rest.restaurantId,
				};
				console.log(`creating event_rest row for `, restRowBody);
				const resp = await axios.post(
					createEventRestRowUrl,
					restRowBody,
					authConfig
				);
				console.log(`Post attempt rest ${rest.restaurantId} success:`, resp);
			}
			console.groupEnd();

			// Step4: Add event guests links
			console.groupCollapsed(`Step4: add guest links for each guest`);
			const guestLinkUrl = `${baseUrl}/guest`;
			const guestLinkBody = {
				guestId: 0,
				eventId: createdEvent.data.eventId,
				guestLink: '',
			};
			for (let i = 0; i < createdEvent.data.numberOfGuests; i++) {
				console.log(`Guest link ${i}/${createdEvent.data.numberOfGuests}`);
				const resp = await axios.post(guestLinkUrl, guestLinkBody, authConfig);
				console.log(`response:`, resp);
			}
			setAreGuestLinksCreated(true);
			console.groupEnd(`Done creating guest links`);

			// Step5: return guest list
			console.log(`Step5: return guest list`);
			const guestListUrl = `${baseUrl}/guest/list/${createdEvent.data.eventId}`;
			const guestList = await axios.get(guestListUrl, authConfig);
			console.log(`guest list:`, guestList.data);

			// Step6: Add vote trackers
			console.log(`Step6: Add vote trackers`);
			console.groupCollapsed(`Adding vote trackers`);
			const voteTrackerUrl = `${baseUrl}/voted`;
			for (const guest of guestList.data) {
				for (const rest of restaurantList.data) {
					const voteTrackerBody = {
						eventId: createdEvent.data.eventId,
						guestId: guest.guestId,
						restaurantId: rest.restaurantId,
					};
					const resp = await axios.post(
						voteTrackerUrl,
						voteTrackerBody,
						authConfig
					);
					console.log(`response`, resp);
				}
			}
			console.groupEnd(`Done adding vote trackers`);

			console.groupEnd();
			console.log(`event created succesfully`, createdEvent);
			setIsEventCreated(true);
		} catch (error) {
			console.error(`event creation failed`, error);
		}
		console.groupEnd();
	}

	return (
		<div className='box'>
			<Container className='d-flex flex-column align-items-center'>
				<header className='display-1 text-center mb-3'>Create Event</header>
				<main className='d-flex flex-column align-items-center gap-2'>
					<Form className='new-event-form d-flex flex-column gap-2 justify-self-center justify-content-center'>
						<FloatingLabel label='Event Name'>
							<Form.Control
								id='eventName'
								type='text'
								className='event-form--input'
								placeholder='Event Name'
								onChange={(event) => handleFormChange(event)}
								value={formData.eventName}
								disabled={isLoading || isEventCreated}
								required
							/>
						</FloatingLabel>
						<FloatingLabel label='Event Date & time'>
							<Form.Control
								id='eventDateTime'
								type='datetime-local'
								className='event-form--input'
								onChange={(event) => handleFormChange(event)}
								value={formData.eventDateTime}
								disabled={isLoading || isEventCreated}
								required
							/>
						</FloatingLabel>
						<FloatingLabel label='Voting Deadline'>
							<Form.Control
								id='decisionDateTime'
								className='event-form--input'
								type='datetime-local'
								onChange={(event) => handleFormChange(event)}
								value={formData.decisionDateTime}
								disabled={isLoading || isEventCreated}
								required
							/>
						</FloatingLabel>
						<FloatingLabel label='Event Zipcode'>
							<Form.Select
								id='zipCode'
								type='select'
								onChange={(event) => handleFormChange(event)}
								value={formData.zipCode}
								placeholder='Zipcode'
								disabled={isLoading || isEventCreated}
								required
							>
								<option disabled>Choose Zipcode</option>
								<option value={11111}>11111</option>
								<option value={88888}>88888</option>
								<option value={99999}>99999</option>
							</Form.Select>
						</FloatingLabel>
						<FloatingLabel label='Number of Guests (including host)'>
							<Form.Select
								id='numberOfGuests'
								type='select'
								onChange={(event) => handleFormChange(event)}
								value={formData.numberOfGuests}
								disabled={isLoading || isEventCreated}
								required
							>
								<option value={2}>2</option>
								<option value={3}>3</option>
								<option value={4}>4</option>
								<option value={5}>5</option>
							</Form.Select>
						</FloatingLabel>
						<Button
							type='submit'
							className={isLoading && `placeholder-wave`}
							disabled={isLoading || isEventCreated}
							onClick={(event) => handleFormSubmit(event)}
						>
							{isEventCreated
								? `Event Created`
								: isLoading
								? `Creating Event`
								: `Create Event`}
						</Button>
					</Form>

					{areGuestLinksCreated && <GuestLinks eventId={event.eventId} />}
					<Modal
						id='create-event-error-popup'
						size='lg'
						centered
						show={showError}
						onHide={() => setShowError(false)}
						aria-labelledby='create-event-error-popup'
					>
						<Modal.Header closeButton>
							<Modal.Title id='create-event-error-popup--title'>
								Event Creation Error
							</Modal.Title>
						</Modal.Header>
						<Modal.Body id='create-event-error-popup--body'>
							<p>
								Event not created, please check your inputs meet the following
								criteria and try again.
								<ul>
									<li>Event title must be at least 10 characters long</li>
									<li>Voting deadline date/time must be in the future</li>
									<li>Event date/time must be after the voting deadline</li>
								</ul>
							</p>
						</Modal.Body>
					</Modal>
				</main>
			</Container>
		</div>
	);
}
