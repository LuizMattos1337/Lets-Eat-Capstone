package com.techelevator.model;

import javax.validation.constraints.NotBlank;

public class EventGuest {

    @NotBlank
    private Integer guestId;
    @NotBlank
    private int eventId;
    @NotBlank
    private String guestLink;

    public EventGuest() {
    }

    public EventGuest(Integer guestId, int eventId, String guestLink) {
        this.guestId = guestId;
        this.eventId = eventId;
        this.guestLink = guestLink;
    }

    public Integer getGuestId() {
        return guestId;
    }

    public void setGuestId(Integer guestId) {
        this.guestId = guestId;
    }

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public String getGuestLink() {
        return guestLink;
    }

    public void setGuestLink(String guestLink) {
        this.guestLink = guestLink;
    }
}
