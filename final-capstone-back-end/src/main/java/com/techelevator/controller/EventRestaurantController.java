package com.techelevator.controller;

import com.techelevator.dao.EventRestaurantDao;
import com.techelevator.exception.EventRestaurantNotFoundException;
import com.techelevator.model.EventRestaurant;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@RequestMapping("/voting")
public class EventRestaurantController {

    private EventRestaurantDao eventRestaurantDao;

    public EventRestaurantController(EventRestaurantDao eventRestaurantDao) {
        this.eventRestaurantDao = eventRestaurantDao;
    }

    //This controller method gets a ranked list of all columns in the event_restaurant table by event id to use in the Event User and Guest view for the tallies
    @PreAuthorize("permitAll")
    @GetMapping("/{eventId}")
    public List<EventRestaurant>getTallyListByEventId(@Valid @PathVariable int eventId) {
        return eventRestaurantDao.getTallyListByEventId(eventId);
    }

    //This controller method gets 1 row in event_restaurant table by event id and restaurant id for Guest voting update
    @PreAuthorize("permitAll")
    @GetMapping("/{eventId}/{restaurantId}")
    public EventRestaurant getSingleTallyByEventIdAndRestaurantId(@Valid @PathVariable int eventId, @PathVariable int restaurantId) throws EventRestaurantNotFoundException {
        return eventRestaurantDao.getSingleTallyByEventIdAndRestaurantId(eventId, restaurantId);
    }


    //This controller method adds 1 to tally and then updates it in the database to be used in Guest Voting View
    @PreAuthorize("permitAll")
    @PutMapping("/up/{eventId}/{restaurantId}")
    public boolean updateTallyThumbsUp(@Valid @PathVariable int eventId, @PathVariable  int restaurantId ) {
        return eventRestaurantDao.updateTallyThumbsUp(eventId, restaurantId);
    }

    //This controller method subtracts 1 to tally and then updates it in the database to be used in Guest Voting View
    @PreAuthorize("permitAll")
    @PutMapping("/down/{eventId}/{restaurantId}")
    public boolean updateTallyThumbsDown(@Valid @PathVariable int eventId, @PathVariable  int restaurantId ) {
        return eventRestaurantDao.updateTallyThumbsDown(eventId, restaurantId);
    }

    //This controller method creates new rows in event_restaurant table in database when event is created
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public boolean createEventRestaurant(@RequestBody EventRestaurant eventRestaurant) {
        return eventRestaurantDao.createEventRestaurant(eventRestaurant);
    }


}
