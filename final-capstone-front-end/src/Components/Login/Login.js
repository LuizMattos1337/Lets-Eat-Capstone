import React, { useState } from "react";
import { Button, FloatingLabel, Form, Image, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../Shared/baseUrl";
import { useUserUpdate } from "../UserProvider/UserProvider";
import logo from "../LetsEatLogo.png";
export default function LoginNew() {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [showError, setShowError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Adds the user login credentials to the UserProvider.js context
	 * @param {object} user - Object with a username, id, token, and authorities
	 */
	const logIn = useUserUpdate();
	const navigateTo = useNavigate();

	function handleFormChange(event) {
		setFormData((prevData) => ({
			...prevData,
			[event.target.id]: event.target.value,
		}));
	}

	/**
	 * Sends the post request to the backend
	 * If sucessful response, adds user credentials to UserProvider context
	 * If unsucessful response, console logs the error
	 */
	async function handleLogin(event) {
		event.preventDefault();
		try {
			setIsLoading(true);
			const userWithToken = await axios.post(
				baseUrl + "/login",
				formData
			);
			logIn({
				...userWithToken.data.user,
				token: userWithToken.data.token,
			});
			navigateTo("/home");
		} catch (error) {
			console.error(error);
			setShowError(true);
			setIsLoading(false);
		}
	}

	return (
		<>
			<div className="box">
				<Form className="d-flex flex-column align-items-center">
					<Image
						src={logo}
						rounded
						className="m-2"
						style={{ width: "300px" }}
					/>
					<h1 className="display-6">Please sign in</h1>
					<Form.Group controlId="loginUsernameForm">
						<FloatingLabel className="mb-3" label="Username">
							<Form.Control
								id="username"
								type="text"
								placeholder="username"
								onChange={handleFormChange}
								value={formData.username}
								required
							/>
						</FloatingLabel>
					</Form.Group>
					<Form.Group controlId="loginPasswordForm">
						<FloatingLabel className="mb-3" label="Password">
							<Form.Control
								id="password"
								type="password"
								placeholder="password"
								onChange={handleFormChange}
								value={formData.password}
								required
							/>
						</FloatingLabel>
					</Form.Group>

					<Form.Text className="mb-3">
						<Link to="/register"> Need an account?</Link>
					</Form.Text>

					<Button 
						id="button"
						type="submit"
						className={isLoading && "placeholder-wave"}
						disabled={isLoading}
						onClick={(event) => handleLogin(event)}
					>
						{!isLoading ? "Log In" : "Logging In..."}
					</Button>
				</Form>
			</div>
			{/* This modal pops up to inform the user of login errors */}
			<Modal
				size="lg"
				centered
				show={showError}
				onHide={() => setShowError(false)}
				aria-labelledby="login-error-popup"
			>
				<Modal.Header closeButton>
					<Modal.Title id="login-error-popup">
						Login Error
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Invalid username/password. Please try again
				</Modal.Body>
			</Modal>
		</>
	);
}
