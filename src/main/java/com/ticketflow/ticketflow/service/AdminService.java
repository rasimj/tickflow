package com.ticketflow.ticketflow.service;

import com.ticketflow.ticketflow.dto.PendingAgentResponse;
import com.ticketflow.ticketflow.exception.ResourceNotFoundException;
import com.ticketflow.ticketflow.model.User;
import com.ticketflow.ticketflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<PendingAgentResponse> getPendingAgents() {
        return userRepository.findByRoleAndAccountStatus(User.Role.AGENT, User.AccountStatus.PENDING_APPROVAL)
                .stream()
                .map(PendingAgentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public void approveAgent(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setAccountStatus(User.AccountStatus.ACTIVE);
        userRepository.save(user);
    }

    public void rejectAgent(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
}