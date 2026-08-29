package com.result.vitsemesterresult.controller;

import com.result.vitsemesterresult.dto.StudentResultRequest;
import com.result.vitsemesterresult.dto.StudentResultResponse;
import com.result.vitsemesterresult.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @PostMapping
    public ResponseEntity<StudentResultResponse> createResult(
            @RequestBody StudentResultRequest request) {

        StudentResultResponse response =
                resultService.createResult(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<StudentResultResponse>> getAllResults() {

        return ResponseEntity.ok(
                resultService.getAllResults()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResultResponse> getResultById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                resultService.getResultById(id)
        );
    }

    @GetMapping("/prn/{prn}")
    public ResponseEntity<List<StudentResultResponse>> getResultsByPrn(
            @PathVariable String prn) {

        return ResponseEntity.ok(
                resultService.getResultsByPrn(prn)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteResult(
            @PathVariable Long id) {

        resultService.deleteResult(id);

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("success", true);
        response.put("message", "Result deleted successfully.");

        return ResponseEntity.ok(response);
    }
}