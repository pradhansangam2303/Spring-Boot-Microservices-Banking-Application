package org.training.sequence.generator.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.training.sequence.generator.model.entity.Sequence;
import org.training.sequence.generator.repository.SequenceRepository;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SequenceServiceImpl implements SequenceService {

    private final SequenceRepository sequenceRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public Sequence create() {
        String accountNumber = generateUniqueAccountNumber();
        
        Sequence sequence = Sequence.builder()
                .accountNumber(accountNumber)
                .build();
        
        Sequence savedSequence = sequenceRepository.save(sequence);
        log.info("Generated new account number: {}", accountNumber);
        
        return savedSequence;
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        int attempts = 0;
        int maxAttempts = 10;
        
        do {
            accountNumber = generateAccountNumber();
            attempts++;
            
            if (attempts > maxAttempts) {
                throw new RuntimeException("Failed to generate unique account number after " + maxAttempts + " attempts");
            }
        } while (sequenceRepository.existsByAccountNumber(accountNumber));
        
        return accountNumber;
    }

    private String generateAccountNumber() {
        // Generate a 10-digit account number starting with 1000
        StringBuilder accountNumber = new StringBuilder("1000");
        
        // Add 6 more random digits
        for (int i = 0; i < 6; i++) {
            accountNumber.append(secureRandom.nextInt(10));
        }
        
        return accountNumber.toString();
    }
}