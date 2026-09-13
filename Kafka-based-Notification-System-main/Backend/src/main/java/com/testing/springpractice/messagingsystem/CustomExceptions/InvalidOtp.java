package com.testing.springpractice.messagingsystem.CustomExceptions;

public class InvalidOtp extends RuntimeException {
    public InvalidOtp(String message) {
        super(message);
    }
}
