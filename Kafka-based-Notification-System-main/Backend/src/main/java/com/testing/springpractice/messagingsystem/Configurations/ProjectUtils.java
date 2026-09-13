package com.testing.springpractice.messagingsystem.Configurations;

import java.util.concurrent.ThreadLocalRandom;

public class ProjectUtils {
    public static String normaliseString(String string){
        return string.toLowerCase().trim();
    }

    public static String generateJoinCode(String companyName, String username) {
        int random6Digits = ThreadLocalRandom.current().nextInt(1000, 10000);
        int random1digit = ThreadLocalRandom.current().nextInt(1,9);
        String sanitizedName = companyName.replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
        String namePart = String.format("%-4s", sanitizedName.length() >= 4 ? sanitizedName.substring(0, 4) : sanitizedName).replace(' ', 'X');
        String sanitizedUser = username.replaceAll("[^a-zA-Z0-9]", String.valueOf(random1digit)).toUpperCase();
        String userPart = String.format("%-4s", sanitizedUser.length() >= 4 ? sanitizedUser.substring(0, 4) : sanitizedUser).replace(' ', 'X');
        int random4Digits = ThreadLocalRandom.current().nextInt(1000, 10000);
        return random6Digits + namePart + sanitizedUser;
    }
}
