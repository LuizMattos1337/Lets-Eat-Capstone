package com.techelevator.controller;

import com.techelevator.dao.GuestVoteDao;
import com.techelevator.exception.GuestVoteNotFoundException;
import com.techelevator.model.GuestVote;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@RequestMapping("/voted")
public class GuestVoteController {

    private GuestVoteDao guestVoteDao;

    public GuestVoteController(GuestVoteDao guestVoteDao) {
        this.guestVoteDao = guestVoteDao;
    }

    //This controller method gets a list of guest votes for 1 guest from guest_vote table by event id, guest id
    @PreAuthorize("permitAll")
    @GetMapping("/{eventId}/{guestId}")
    public List<GuestVote> getListOfGuestVotes(@Valid @PathVariable int eventId, @PathVariable int guestId) {
        return guestVoteDao.getListOfGuestVotes(eventId, guestId);
    }

    //This controller method gets one row in guest_vote table by event id, guest id, and restaurant id
    @PreAuthorize("permitAll")
    @GetMapping("/{eventId}/{guestId}/{restaurantId}")
    public GuestVote getSingleGuestVote(@Valid @PathVariable int eventId, @PathVariable int guestId, @PathVariable int restaurantId) throws GuestVoteNotFoundException {
        return guestVoteDao.getSingleGuestVote(eventId, guestId, restaurantId);
    }

    //This controller method adds "1" to the vote column in guest_vote table when guest votes up on a restaurant- updated by event id, guest id, and restaurant id
    @PreAuthorize("permitAll")
    @PutMapping("/up/{eventId}/{guestId}/{restaurantId}")
    public boolean addGuestVoteUp(@Valid @PathVariable int eventId, @PathVariable int guestId, @PathVariable int restaurantId) {
        return guestVoteDao.addGuestVoteUp(eventId, guestId, restaurantId);
    }

    //This controller method adds "-1" to the vote column of a restaurant in guest_vote table when guest votes up on a restaurant- updated by event id, guest id, and restaurant id
    @PreAuthorize("permitAll")
    @PutMapping("/down/{eventId}/{guestId}/{restaurantId}")
    public boolean addguestVoteDown(@Valid @PathVariable int eventId, @PathVariable int guestId, @PathVariable int restaurantId) {
        return guestVoteDao.addGuestVoteDown(eventId, guestId, restaurantId);
    }

    //This controller method adds a row for each restaurant in an event per each guest invited to the event to track the voting of the guest
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public boolean createGuestVote(@RequestBody GuestVote guestVote) {
        return guestVoteDao.createGuestVote(guestVote);
    }
}
