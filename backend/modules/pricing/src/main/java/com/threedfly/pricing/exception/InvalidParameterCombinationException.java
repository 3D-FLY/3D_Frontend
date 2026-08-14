package com.threedfly.pricing.exception;

public class InvalidParameterCombinationException extends RuntimeException {
    public InvalidParameterCombinationException(String message) {
        super(message);
    }

    public InvalidParameterCombinationException(String message, Throwable cause) {
        super(message, cause);
    }
}
