import React, { useState } from "react";
import { Button, FloatingLabel, Form, Modal, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../Shared/baseUrl";
import logo from "../LetsEatLogo.png";


export default function Register() {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [showSuccess, setShowSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate()

	function validateFormData() {
		/**
		 * Breakdown of regex:
		 * ^ - Start of regex
		 * (?=(.*[a-z]){1,}) - at least 1 lowercase
		 * (?=(.*[A-Z]){1,}) - at least 1 uppercase
		 * (?=(.*[0-9]){1,}) - at least 1 number
		 * (?=(.*[!@#$%^&*()\-__+.]){1,}) - at least 1 of these special characters
		 * .{8,16} - min length 8, max length 16
		 * $ - end of regex
		 *
		 * Regex tester at: https://rubular.com/r/9WpKkfDVjujnXa
		 */
		const passwordRegex = new RegExp(
			`^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()-__+.]){1,}).{8,16}$`
		);

		if (!passwordRegex.test(formData.password)) {
			setErrorMessage(
				`Password doesn't meet minimum strength requirement. Your password
				must be between 8 and 16 characters in length and include at least
				1 uppercase letter, 1 lowercase letter, 1 number and 1 special 
				character (!@#$%^&*-__+.)`
			);
			return false;
		}

		if (formData.password !== formData.confirmPassword) {
			setErrorMessage(`Passwords must match`);
			return false;
		}

		if (formData.username.length < 6){
			setErrorMessage(`Username must be at least 6 characters in length`)
			return false
		}

		return true;
	}

	function handleFormChange(event) {
		setFormData((prevData) => ({
			...prevData,
			[event.target.id]: event.target.value,
		}));
	}

	/**
	 * Sends the registration request to the server.
	 * If successful, displays the success modal then nativates to /login.
	 * If unsuccessful, displays error modal and stays on page for retry.
	 */
	async function handleRegister(event) {
		event.preventDefault();
		if (!validateFormData()) {
			setShowError(true);
			return;
		}
		try {
			setIsLoading(true);
			const registrationData = {
				...formData,
				role: "USER",
			};
			const resp = await axios.post(
				baseUrl + `/register`,
				registrationData
			);
			console.log(resp);
			setShowSuccess(true);
		} catch (error) {
			console.log(error.toJSON());
			if (error.response) {
				console.log(error.response.data);
				setErrorMessage(error.response.data.message);
			} else {
				setErrorMessage(null);
			}
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
				<Form className="d-flex flex-column align-items-center" noValidate>
					<h1 className="display-6">Please Register</h1>
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
					<Form.Group controlId="loginPasswordForms">
						<FloatingLabel className="mb-3" label="Password">
							<Form.Control
								id="password"
								type="password"
								required
								placeholder="password"
								onChange={handleFormChange}
								value={formData.password}
								noValidate
							/>
						</FloatingLabel>
						<FloatingLabel className="mb-3" label="Confirm Password">
							<Form.Control
								id="confirmPassword"
								type="password"
								required
								placeholder="Confirm Password"
								onChange={handleFormChange}
								value={formData.confirmPassword}
								noValidate
							/>
						</FloatingLabel>
					</Form.Group>

					<Form.Text className="mb-3">
						<Link to="/login"> Already have an account?</Link>
					</Form.Text>

					<Button 
						id="button"
						className={isLoading && "placeholder-wave"}
						type="submit"
						disabled={isLoading}
						onClick={(event) => handleRegister(event)}
					>
						{isLoading ? "Registering..." : "Register"}
					</Button>
				</Form>
				</Form>
			</div>
			<Modal
				id="registration-error-popup"
				size="lg"
				centered
				show={showError}
				onHide={() => setShowError(false)}
				aria-labelledby="registration-error-popup"
			>
				<Modal.Header closeButton>
					<Modal.Title id="registration-error-popup">
						Registration Error
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						Registration failed!
						<br />
						{errorMessage}
					</p>
					Please try again
				</Modal.Body>
			</Modal>

			<Modal
				id="registration-success-popup"
				size="lg"
				centered
				show={showSuccess}
				onHide={() => {
					setShowSuccess(false);
					navigate('/login')
					
				}}
				aria-labelledby="registration-success-popup"
			>
				<Modal.Header closeButton>
					<Modal.Title id="registration-success-popup">
						Success!
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Registration successful! Redirecting to the login page...
				</Modal.Body>
			</Modal>
		</>
	);
}
