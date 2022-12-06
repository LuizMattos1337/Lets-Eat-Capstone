package com.techelevator.controller;


import com.techelevator.dao.EventDao;
import com.techelevator.exception.EventNotFoundException;
import com.techelevator.model.Event;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@RequestMapping("/event")
public class EventController {

    private EventDao eventDao;

    public EventController(EventDao eventDao) {
        this.eventDao = eventDao;
    }

    //This controller method requests the events by username of logged-in user for the User's All Events View
    @GetMapping("/{username}")
    public List<Event>getEventsByUsername(@Valid @PathVariable String username) {
        return eventDao.getEventsByUsername(username);
    }

    //This controller method gets one event by event id
    @PreAuthorize("permitAll")
    @GetMapping("/view/{eventId}")
    public Event getSingleEventByEventId(@Valid @PathVariable int eventId) throws EventNotFoundException {
        return eventDao.getSingleEventByEventId(eventId);
    }

    //This controller method posts a new event
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public Event createEvent(@RequestBody Event event) {
        return eventDao.createEvent(event);
    }

    //This controller method adds the restaurant id of restaurant that host chooses to final_choice_id column, by event id being added to, and restaurant id of choice
    @PreAuthorize("permitAll")
    @PutMapping("update/{eventId}/{restaurantId}")
    public boolean updateFinalChoiceId(@Valid @PathVariable int eventId, @PathVariable int restaurantId) {
        return eventDao.addFinalChoiceId(eventId, restaurantId);
    }
}
