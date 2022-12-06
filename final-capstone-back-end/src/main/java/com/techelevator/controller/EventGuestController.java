package com.techelevator.controller;

import com.techelevator.dao.EventGuestDao;
import com.techelevator.exception.EventGuestNotFoundException;
import com.techelevator.model.EventGuest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@RequestMapping("/guest")
public class EventGuestController {

    private EventGuestDao eventGuestDao;

    public EventGuestController(EventGuestDao eventGuestDao) {
        this.eventGuestDao = eventGuestDao;
    }

    //This controller method gets a list of guest id, event id, and guest links by event id
    @PreAuthorize("permitAll")
    @GetMapping("/list/{eventId}")
    public List<EventGuest> getGuestList(@Valid @PathVariable int eventId) {
        return eventGuestDao.getGuestList(eventId);
    }

    //This controller method gets 1 row in event_guest table by guest id
    @PreAuthorize("permitAll")
    @GetMapping("/view/{guestId}")
    public EventGuest getSingleGuest(@Valid @PathVariable int guestId) throws EventGuestNotFoundException {
        return eventGuestDao.getSingleGuest(guestId);
    }

    //This controller method gets 1 row in event_guest table by guest link
    @PreAuthorize("permitAll")
    @GetMapping("/link/{guestLink}")
    public EventGuest getSingleGuestByLink(@Valid @PathVariable String guestLink) throws EventGuestNotFoundException {
        return eventGuestDao.getSingleGuestByLink(guestLink);
    }

    //This method creates guest row in event_guest table
    @PostMapping("")
    public EventGuest createEventGuest(@RequestBody EventGuest eventGuest) {
        return eventGuestDao.createEventGuest(eventGuest);
    }

}
