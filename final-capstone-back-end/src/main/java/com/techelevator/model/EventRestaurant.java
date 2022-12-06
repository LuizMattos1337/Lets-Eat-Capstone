package com.techelevator.model;

import javax.validation.constraints.NotBlank;

public class EventRestaurant {

    @NotBlank
    private int eventId;
    @NotBlank
    private int restaurantId;
    private int tally;

    public EventRestaurant() {
    }

    public EventRestaurant(int eventId, int restaurantId, int tally) {
        this.eventId = eventId;
        this.restaurantId = restaurantId;
        this.tally = tally;
    }

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public int getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(int restaurantId) {
        this.restaurantId = restaurantId;
    }

    public int getTally() {
        return tally;
    }

    public void setTally(int tally) {
        this.tally = tally;
    }
}
