package com.ticketflow.ticketflow.service;

import com.ticketflow.ticketflow.dto.CommentRequest;
import com.ticketflow.ticketflow.dto.CommentResponse;
import com.ticketflow.ticketflow.exception.ResourceNotFoundException;
import com.ticketflow.ticketflow.model.Comment;
import com.ticketflow.ticketflow.model.Ticket;
import com.ticketflow.ticketflow.model.User;
import com.ticketflow.ticketflow.repository.CommentRepository;
import com.ticketflow.ticketflow.repository.TicketRepository;
import com.ticketflow.ticketflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public CommentResponse addComment(Long ticketId, CommentRequest request, String authorEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authorEmail));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTicket(ticket);
        comment.setAuthor(author);

        return CommentResponse.fromEntity(commentRepository.save(comment));
    }

    public List<CommentResponse> getCommentsForTicket(Long ticketId) {
        return commentRepository.findByTicketId(ticketId)
                .stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }
}