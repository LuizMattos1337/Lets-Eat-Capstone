package com.techelevator.exception;

import com.techelevator.model.EventRestaurant;

public class EventRestaurantNotFoundException extends Exception {
    public EventRestaurantNotFoundException() {
        super();
    }

    public EventRestaurantNotFoundException(String message) {
        super(message);

    }

}
