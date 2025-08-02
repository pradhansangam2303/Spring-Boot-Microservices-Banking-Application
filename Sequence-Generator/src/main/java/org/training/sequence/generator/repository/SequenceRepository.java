package org.training.sequence.generator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.training.sequence.generator.model.entity.Sequence;

import java.util.Optional;

@Repository
public interface SequenceRepository extends JpaRepository<Sequence, Long> {

    Optional<Sequence> findByAccountNumber(String accountNumber);

    boolean existsByAccountNumber(String accountNumber);
}