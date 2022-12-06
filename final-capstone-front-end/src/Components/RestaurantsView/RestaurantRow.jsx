/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { useParams } from 'react-router';
import { baseUrl } from '../../Shared/baseUrl';
import { useUser } from '../UserProvider/UserProvider';
import Image from 'react-bootstrap/Image';

export default function RestaurantRow(props) {
	const [restaurant, setRestaurant] = useState({ ...props, tally: 0 });
	const [eventAndGuestList, setEventAndGuestList] = useState({
		guestList: [{ guestId: 0 }],
	});
	const [guestId, setGuestId] = useState(0);
	const [isTallyLoading, setIsTallyLoading] = useState(false);
	const [isVoteLoading, setIsVoteLoading] = useState(false);
	const [voteWas, setVoteWas] = useState(0);
	const user = useUser();
	const { mode, finalChoiceId, refreshEventFunction } = props;
	const authConfig = {
		headers: { Authorization: `Bearer ${user.token}` },
	};
	const isFinalChoiceMade = finalChoiceId !== 0;
	const { guestLink } = useParams();

	useEffect(() => {
		const asyncFunctions = async () => {
			updateTally();
			getEventAndGuests();
			checkVote();
		};
		asyncFunctions().catch(console.error);
		return () => {
			/* Clean up functions */
		};
	}, []);

	async function updateTally() {
		const fetchUrl = `${baseUrl}/voting/${props.searchTerm}/${restaurant.restaurantId}`;
		try {
			setIsTallyLoading(true);
			const updatedTally = await axios.get(fetchUrl, authConfig);
			setRestaurant((prevState) => ({
				...prevState,
				tally: updatedTally.data.tally,
			}));
		} catch (error) {
			console.error(error);
		}
		setIsTallyLoading(false);
	}
	async function getEventAndGuests() {
		if (mode === 'byEventId' || mode === 'byEventIdFinalist') {
			try {
				const eventResp = await axios.get(
					`${baseUrl}/event/view/${props.searchTerm}`
				);
				let eventData = eventResp.data;
				const guestListResp = await axios.get(
					`${baseUrl}/guest/list/${eventData.eventId}`
				);
				eventData = { ...eventData, guestList: guestListResp.data };
				setEventAndGuestList(eventData);
				if (guestLink !== undefined) {
					const guestIdResp = await axios.get(
						`${baseUrl}/guest/link/${guestLink}`
					);
					const thisGuestId = guestIdResp.data.guestId;
					setGuestId(thisGuestId);
				} else {
				}
			} catch (error) {
				console.error(error);
			}
		}
		checkVote();
	}
	async function checkVote() {
		const thisEventId = eventAndGuestList.eventId;
		const thisRestId = restaurant.restaurantId;
		const thisGuestId =
			guestId !== 0 ? guestId : eventAndGuestList.guestList[0].guestId;
		const fetchUrl = `${baseUrl}/voted/${thisEventId}/${thisGuestId}/${thisRestId}`;
		try {
			const voteResp = await axios.get(fetchUrl);
			setVoteWas(voteResp.data.vote);
		} catch (error) {
			console.error(error);
		}
	}
	async function sendVote(upOrDown = 'up') {
		const thisEventId = props.searchTerm;
		const thisRestId = restaurant.restaurantId;
		setIsVoteLoading(true);
		try {
			// Step 1: Increment Tally
			const incrementTallyUrl = `${baseUrl}/voting/${upOrDown}/${thisEventId}/${thisRestId}`;
			await axios.put(incrementTallyUrl);
			// Step 2: Track the vote
			const thisGuestId =
				user.id === eventAndGuestList.userId
					? eventAndGuestList.guestList[0].guestId
					: guestId;
			await axios.put(
				`${baseUrl}/voted/${upOrDown}/${thisEventId}/${thisGuestId}/${thisRestId}`
			);

			updateTally();
			checkVote();
		} catch (error) {
			console.error(error);
			setIsVoteLoading(false);
		}
	}

	async function sendFinalChoice() {
		if (user.id === eventAndGuestList.userId) {
			const fetchUrl = `${baseUrl}/event/update/${eventAndGuestList.eventId}/${restaurant.restaurantId}`;
			setIsVoteLoading(true);

			try {
				await axios.put(fetchUrl, authConfig);

				getEventAndGuests();
				setIsVoteLoading(false);
				refreshEventFunction();
			} catch (error) {
				console.error(error);
				setIsVoteLoading(false);
			}
		}
	}

	function generateButtons() {
		const isVotingOver = mode === 'byEventIdFinalist';
		checkVote();
		if (!isVotingOver) {
			return (
				<>
					<td>
						<ButtonGroup>
							<Button
								className='upvote-btn'
								disabled={voteWas !== 0}
								variant={voteWas === 1 ? 'success' : 'outline-success'}
								size='sm'
								onClick={() => sendVote(`up`)}
							>
								👍
							</Button>
							<Button
								className={
									'tally-btn' + (isTallyLoading && ' placeholder-wave')
								}
								variant={isTallyLoading ? 'info' : 'outline-primary'}
								disabled={isTallyLoading}
								size='sm'
								onClick={() => updateTally()}
							>
								{restaurant.tally}
							</Button>
							<Button
								className='downvote-btn'
								disabled={voteWas !== 0}
								variant={voteWas === -1 ? 'danger' : 'outline-danger'}
								size='sm'
								onClick={() => sendVote(`down`)}
							>
								👎
							</Button>
						</ButtonGroup>
					</td>
				</>
			);
		}
		if (!isFinalChoiceMade) {
			return (
				<td>
					<ButtonGroup>
						<Button
							className='final-choice-btn'
							variant={
								isVoteLoading ? 'warning placeholder-wave' : 'outline-warning'
							}
							size='sm'
							onClick={() => sendFinalChoice()}
							disabled={isVoteLoading}
						>
							🌟
						</Button>{' '}
						<Button
							className={'tally-btn' + (isTallyLoading && ' placeholder-wave')}
							variant={isTallyLoading ? 'info' : 'outline-primary'}
							disabled={isTallyLoading}
							size='sm'
							onClick={() => updateTally()}
						>
							{restaurant.tally}
						</Button>
					</ButtonGroup>
				</td>
			);
		} else {
			return (
				<>
					<td>
						<ButtonGroup>
							<Button
								className='final-choice-btn'
								disabled={finalChoiceId !== restaurant.restaurantId}
								variant={
									finalChoiceId === restaurant.restaurantId
										? 'warning'
										: 'outline-secondary'
								}
								size='sm'
							>
								🌟
							</Button>
						</ButtonGroup>
					</td>
				</>
			);
		}
	}

	return (
		<>
			<tr className='align-items-center text-center'>
				<td className='dev-mode'>
					<Button size='sm' onClick={() => refreshEventFunction()}>
						refresh event
					</Button>
				</td>
				{mode === 'byZipcode' && (
					<td className='logoImages'>
						{<Image src={restaurant.logo} fluid />}
					</td>
				)}
				<td className='align-items-center'>{restaurant.restaurantName}</td>

				<td>{restaurant.restaurantGenre}</td>
				<td className=''>{restaurant.restaurantAddress}</td>
				{mode === 'byZipcode' && (
					<>
						<td>{restaurant.openTime}</td>
						<td>{restaurant.closeTime}</td>
					</>
				)}

				<td>{'💲'.repeat(restaurant.priceRange)}</td>
				{(mode === 'byEventId' || mode === 'byEventIdFinalist') &&
					generateButtons()}

				<td>
					<Button
						variant={restaurant.hasNumber ? 'info' : 'outline-secondary'}
						size='sm'
						disabled={!restaurant.hasNumber}
					>
						☎️
					</Button>
				</td>
			</tr>
		</>
	);
}
