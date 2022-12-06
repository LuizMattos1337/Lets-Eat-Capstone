package com.techelevator.helper;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;

import java.util.Random;

public class GuestLink {

    public GuestLink() {
    }

    public static String makeGuestLink() {
        Random random = new Random();

        char[] alphabet = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
                            'p', 'q', 'r', 's', 't','u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
                            '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
                            'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T','u', 'V', 'W', 'X',
                            'Y', 'Z'};
        int size = 10;

        return NanoIdUtils.randomNanoId(random, alphabet, size);

    }


}
