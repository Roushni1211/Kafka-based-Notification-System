package com.testing.springpractice.messagingsystem.CustomExceptions;

public class CompanyNotExistException extends RuntimeException {
    public CompanyNotExistException(String message) {
        super(message);
    }
}
