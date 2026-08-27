package com.ticketflow.ticketflow.service;

import com.ticketflow.ticketflow.dto.TicketRequest;
import com.ticketflow.ticketflow.dto.TicketResponse;
import com.ticketflow.ticketflow.exception.InvalidStatusTransitionException;
import com.ticketflow.ticketflow.exception.ResourceNotFoundException;
import com.ticketflow.ticketflow.model.Ticket;
import com.ticketflow.ticketflow.model.User;
import com.ticketflow.ticketflow.repository.TicketRepository;
import com.ticketflow.ticketflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    private static final Map<Ticket.Status, Set<Ticket.Status>> ALLOWED_TRANSITIONS = Map.of(
            Ticket.Status.OPEN, Set.of(Ticket.Status.IN_PROGRESS),
            Ticket.Status.IN_PROGRESS, Set.of(Ticket.Status.RESOLVED, Ticket.Status.OPEN),
            Ticket.Status.RESOLVED, Set.of(Ticket.Status.CLOSED, Ticket.Status.IN_PROGRESS),
            Ticket.Status.CLOSED, Set.of()
    );

    public TicketResponse createTicket(TicketRequest request, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + creatorEmail));

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setCreatedBy(creator);

        Ticket saved = ticketRepository.save(ticket);
        return TicketResponse.fromEntity(saved);
    }

    public List<TicketResponse> getAllTickets(String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + requesterEmail));

        List<Ticket> tickets = requester.getRole() == User.Role.CUSTOMER
                ? ticketRepository.findByCreatedByEmail(requesterEmail)
                : ticketRepository.findAll();

        return tickets.stream().map(TicketResponse::fromEntity).collect(Collectors.toList());
    }

    public TicketResponse getTicketById(Long id) {
        return TicketResponse.fromEntity(findTicketOrThrow(id));
    }

    public TicketResponse updateTicket(Long id, TicketRequest request) {
        Ticket ticket = findTicketOrThrow(id);
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        return TicketResponse.fromEntity(ticketRepository.save(ticket));
    }

    public TicketResponse updateStatus(Long id, Ticket.Status newStatus) {
        Ticket ticket = findTicketOrThrow(id);
        Ticket.Status current = ticket.getStatus();

        if (!ALLOWED_TRANSITIONS.get(current).contains(newStatus)) {
            throw new InvalidStatusTransitionException(
                    "Cannot change status from " + current + " to " + newStatus);
        }

        ticket.setStatus(newStatus);
        return TicketResponse.fromEntity(ticketRepository.save(ticket));
    }

    public void deleteTicket(Long id) {
        ticketRepository.delete(findTicketOrThrow(id));
    }

    private Ticket findTicketOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }
}