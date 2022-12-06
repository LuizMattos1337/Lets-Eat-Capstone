package com.techelevator.controller;


import com.techelevator.dao.RestaurantDao;
import com.techelevator.model.Restaurant;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@RequestMapping("/restaurant")
public class RestaurantController {

    private RestaurantDao restaurantDao;

    public RestaurantController(RestaurantDao restaurantDao) {
        this.restaurantDao = restaurantDao;
    }

    //This controller method requests the restaurants by zipcode selected.
    @GetMapping("/zipcode/{zipCode}")
    public List<Restaurant>getRestaurantsByZipCode(@Valid @PathVariable Integer zipCode) {
        return restaurantDao.getRestaurantsByZipCode(zipCode);
    }

    //This controller method requests the restaurants by eventId, ranked by tally desc
    @PreAuthorize("permitAll")
    @GetMapping("/ranked/{eventId}")
    public List<Restaurant>getRankedRestaurants(@Valid @PathVariable Integer eventId) {
        return restaurantDao.getRankedRestaurantsForEvent(eventId);
    }

}
