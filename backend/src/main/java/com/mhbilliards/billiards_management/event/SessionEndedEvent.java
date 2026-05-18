package com.mhbilliards.billiards_management.event;

public class SessionEndedEvent {

    private final Long sessionId;

    public SessionEndedEvent(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getSessionId() {
        return sessionId;
    }
}
