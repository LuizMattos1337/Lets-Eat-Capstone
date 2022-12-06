package com.techelevator.model;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class Event {

    @NotBlank
    private Integer eventId;
    @NotBlank
    private String eventName;
    @NotBlank
    private LocalDateTime eventDateTime;
    @NotBlank
    private int zipCode;
    @NotBlank
    private LocalDateTime decisionDateTime;
    @NotBlank
    private int numberOfGuests;
    @NotBlank
    private Long userId;
    private int finalChoiceId;

    public Event() {
    }

    public Event(Integer eventId) {
        this.eventId = eventId;
    }

    public Event(Integer eventId, String eventName, LocalDateTime eventDateTime, int zipCode, LocalDateTime decisionDateTime, int numberOfGuests, Long userId, int finalChoiceId) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.eventDateTime = eventDateTime;
        this.zipCode = zipCode;
        this.decisionDateTime = decisionDateTime;
        this.numberOfGuests = numberOfGuests;
        this.userId = userId;
        this.finalChoiceId = finalChoiceId;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public LocalDateTime getEventDateTime() {
        return eventDateTime;
    }

    public void setEventDateTime(LocalDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
    }

    public int getZipCode() {
        return zipCode;
    }

    public void setZipCode(int zipCode) {
        this.zipCode = zipCode;
    }

    public LocalDateTime getDecisionDateTime() {
        return decisionDateTime;
    }

    public void setDecisionDateTime(LocalDateTime decisionDateTime) {
        this.decisionDateTime = decisionDateTime;
    }

    public int getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(int numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getFinalChoiceId() {
        return finalChoiceId;
    }

    public void setFinalChoiceId(int finalChoiceId) {
        this.finalChoiceId = finalChoiceId;
    }
}
