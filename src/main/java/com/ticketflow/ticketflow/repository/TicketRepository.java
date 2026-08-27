package com.ticketflow.ticketflow.repository;

import com.ticketflow.ticketflow.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedByEmail(String email);
}