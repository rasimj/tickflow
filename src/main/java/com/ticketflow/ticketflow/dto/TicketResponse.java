package com.ticketflow.ticketflow.dto;

import com.ticketflow.ticketflow.model.Ticket;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private Ticket.Status status;
    private Ticket.Priority priority;
    private LocalDateTime createdAt;
    private String createdByName;

    public static TicketResponse fromEntity(Ticket ticket) {
        TicketResponse res = new TicketResponse();
        res.setId(ticket.getId());
        res.setTitle(ticket.getTitle());
        res.setDescription(ticket.getDescription());
        res.setStatus(ticket.getStatus());
        res.setPriority(ticket.getPriority());
        res.setCreatedAt(ticket.getCreatedAt());
        if (ticket.getCreatedBy() != null) {
            res.setCreatedByName(ticket.getCreatedBy().getName());
        }
        return res;
    }
}