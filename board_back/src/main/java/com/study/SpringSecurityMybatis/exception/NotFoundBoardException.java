package com.study.SpringSecurityMybatis.exception;

public class NotFoundBoardException extends RuntimeException {

    public NotFoundBoardException(String message) {
        super(message);
    }
}
