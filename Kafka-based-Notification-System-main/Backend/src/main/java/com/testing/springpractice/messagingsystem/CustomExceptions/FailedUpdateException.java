package com.testing.springpractice.messagingsystem.CustomExceptions;

public class FailedUpdateException extends RuntimeException {
    public FailedUpdateException(String message) {
        super(message);
    }
}
