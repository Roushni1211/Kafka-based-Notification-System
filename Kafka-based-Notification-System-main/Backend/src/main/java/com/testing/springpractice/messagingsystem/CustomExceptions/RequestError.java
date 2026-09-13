package com.testing.springpractice.messagingsystem.CustomExceptions;

public class RequestError extends RuntimeException {
    public RequestError(String message) {
        super(message);
    }
}
