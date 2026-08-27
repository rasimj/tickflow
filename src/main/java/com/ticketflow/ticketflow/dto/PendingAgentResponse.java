package com.ticketflow.ticketflow.dto;

import com.ticketflow.ticketflow.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingAgentResponse {
    private Long id;
    private String name;
    private String email;

    public static PendingAgentResponse fromEntity(User user) {
        return new PendingAgentResponse(user.getId(), user.getName(), user.getEmail());
    }
}