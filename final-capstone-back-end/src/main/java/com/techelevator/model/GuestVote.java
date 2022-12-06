package com.techelevator.model;

import javax.validation.constraints.NotBlank;

public class GuestVote {

    @NotBlank
    private int eventId;
    @NotBlank
    private int guestId;
    @NotBlank
    private int restaurantId;
    private int vote;

    public GuestVote() {
    }

    public GuestVote(int eventId, int guestId, int restaurantId, int vote) {
        this.eventId = eventId;
        this.guestId = guestId;
        this.restaurantId = restaurantId;
        this.vote = vote;
    }

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public int getGuestId() {
        return guestId;
    }

    public void setGuestId(int guestId) {
        this.guestId = guestId;
    }

    public int getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(int restaurantId) {
        this.restaurantId = restaurantId;
    }

    public int getVote() {
        return vote;
    }

    public void setVote(int vote) {
        this.vote = vote;
    }
}
