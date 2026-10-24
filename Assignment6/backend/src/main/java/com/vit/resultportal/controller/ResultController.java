package com.vit.resultportal.controller;

import com.vit.resultportal.model.StudentResult;
import com.vit.resultportal.repository.StudentResultRepository;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {
    private final StudentResultRepository repository;

    public ResultController(StudentResultRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> myResult(Authentication authentication) {
        return repository.findByUsername(authentication.getName())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No result found for this student"));
    }

    @GetMapping
    public List<StudentResult> allResults() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<StudentResult> saveResult(@RequestBody StudentResult result) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResult(@PathVariable Long id, @RequestBody StudentResult updated) {
        return repository.findById(id).map(existing -> {
            existing.setUsername(updated.getUsername());
            existing.setStudentName(updated.getStudentName());
            existing.setPrn(updated.getPrn());
            existing.setBranch(updated.getBranch());
            existing.setSemester(updated.getSemester());
            existing.setSubject1(updated.getSubject1());
            existing.setMse1(updated.getMse1());
            existing.setEse1(updated.getEse1());
            existing.setSubject2(updated.getSubject2());
            existing.setMse2(updated.getMse2());
            existing.setEse2(updated.getEse2());
            existing.setSubject3(updated.getSubject3());
            existing.setMse3(updated.getMse3());
            existing.setEse3(updated.getEse3());
            existing.setSubject4(updated.getSubject4());
            existing.setMse4(updated.getMse4());
            existing.setEse4(updated.getEse4());
            return ResponseEntity.ok(repository.save(existing));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResult(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.ok("Result deleted");
    }
}
