package com.vit.resultportal.repository;

import com.vit.resultportal.model.StudentResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {
    Optional<StudentResult> findByUsername(String username);
}
