package com.techelevator.exception;

public class GuestVoteNotFoundException extends Exception {

    public GuestVoteNotFoundException() {
        super();
    }

    public GuestVoteNotFoundException(String message) {
        super(message);
    }
}
