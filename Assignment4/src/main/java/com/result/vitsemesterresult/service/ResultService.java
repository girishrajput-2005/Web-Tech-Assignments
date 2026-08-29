package com.result.vitsemesterresult.service;

import com.result.vitsemesterresult.dto.StudentResultRequest;
import com.result.vitsemesterresult.dto.StudentResultResponse;
import com.result.vitsemesterresult.dto.SubjectMarkRequest;
import com.result.vitsemesterresult.dto.SubjectResultResponse;
import com.result.vitsemesterresult.entity.StudentResult;
import com.result.vitsemesterresult.entity.SubjectResult;
import com.result.vitsemesterresult.exception.ResultNotFoundException;
import com.result.vitsemesterresult.repository.StudentResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final StudentResultRepository studentResultRepository;

    public StudentResultResponse createResult(StudentResultRequest request) {

        validateStudentDetails(request);

        if (studentResultRepository
                .findByPrnAndSemesterAndAcademicYear(
                        request.getPrn(),
                        request.getSemester(),
                        request.getAcademicYear()
                )
                .isPresent()) {

            throw new IllegalArgumentException(
                    "A result already exists for this PRN, semester and academic year."
            );
        }

        StudentResult studentResult = new StudentResult();

        studentResult.setPrn(request.getPrn().trim());
        studentResult.setStudentName(request.getStudentName().trim());
        studentResult.setBranch(request.getBranch().trim());
        studentResult.setSemester(request.getSemester());
        studentResult.setAcademicYear(request.getAcademicYear().trim());

        List<SubjectResult> subjects = new ArrayList<>();

        int grandTotal = 0;
        boolean allSubjectsPassed = true;

        for (SubjectMarkRequest subjectRequest : request.getSubjects()) {

            validateSubject(subjectRequest);

            int subjectTotal =
                    subjectRequest.getSee() + subjectRequest.getEse();

            SubjectResult subjectResult = new SubjectResult();

            subjectResult.setSubjectName(subjectRequest.getName().trim());
            subjectResult.setSeeMarks(subjectRequest.getSee());
            subjectResult.setEseMarks(subjectRequest.getEse());
            subjectResult.setTotalMarks(subjectTotal);

            subjects.add(subjectResult);

            grandTotal += subjectTotal;

            /*
             * Assignment-level passing rule:
             * Each subject should have at least 40/100.
             *
             * If your faculty gives a different VIT passing rule,
             * this condition can be changed.
             */
            if (subjectTotal < 40) {
                allSubjectsPassed = false;
            }
        }

        double percentage = (grandTotal / 400.0) * 100;

        percentage = Math.round(percentage * 100.0) / 100.0;

        studentResult.setSubjects(subjects);
        studentResult.setGrandTotal(grandTotal);
        studentResult.setPercentage(percentage);
        studentResult.setResultStatus(
                allSubjectsPassed ? "PASS" : "FAIL"
        );

        StudentResult savedResult =
                studentResultRepository.save(studentResult);

        return convertToResponse(savedResult);
    }

    public List<StudentResultResponse> getAllResults() {

        return studentResultRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public StudentResultResponse getResultById(Long id) {

        StudentResult result =
                studentResultRepository.findById(id)
                        .orElseThrow(() ->
                                new ResultNotFoundException(
                                        "Result not found with ID: " + id
                                )
                        );

        return convertToResponse(result);
    }

    public List<StudentResultResponse> getResultsByPrn(String prn) {

        List<StudentResult> results =
                studentResultRepository
                        .findByPrnIgnoreCaseOrderBySemesterAsc(prn);

        if (results.isEmpty()) {
            throw new ResultNotFoundException(
                    "No result found for PRN: " + prn
            );
        }

        return results
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public void deleteResult(Long id) {

        if (!studentResultRepository.existsById(id)) {
            throw new ResultNotFoundException(
                    "Result not found with ID: " + id
            );
        }

        studentResultRepository.deleteById(id);
    }

    private void validateStudentDetails(StudentResultRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Request data cannot be empty."
            );
        }

        if (isBlank(request.getPrn())) {
            throw new IllegalArgumentException(
                    "PRN is required."
            );
        }

        if (isBlank(request.getStudentName())) {
            throw new IllegalArgumentException(
                    "Student name is required."
            );
        }

        if (isBlank(request.getBranch())) {
            throw new IllegalArgumentException(
                    "Branch is required."
            );
        }

        if (request.getSemester() == null ||
                request.getSemester() < 1 ||
                request.getSemester() > 8) {

            throw new IllegalArgumentException(
                    "Semester must be between 1 and 8."
            );
        }

        if (isBlank(request.getAcademicYear())) {
            throw new IllegalArgumentException(
                    "Academic year is required."
            );
        }

        if (request.getSubjects() == null ||
                request.getSubjects().size() != 4) {

            throw new IllegalArgumentException(
                    "Exactly four subjects are required."
            );
        }
    }

    private void validateSubject(SubjectMarkRequest subject) {

        if (subject == null) {
            throw new IllegalArgumentException(
                    "Subject information cannot be empty."
            );
        }

        if (isBlank(subject.getName())) {
            throw new IllegalArgumentException(
                    "Subject name is required."
            );
        }

        if (subject.getSee() == null ||
                subject.getSee() < 0 ||
                subject.getSee() > 30) {

            throw new IllegalArgumentException(
                    "SEE marks must be between 0 and 30."
            );
        }

        if (subject.getEse() == null ||
                subject.getEse() < 0 ||
                subject.getEse() > 70) {

            throw new IllegalArgumentException(
                    "ESE marks must be between 0 and 70."
            );
        }
    }

    private boolean isBlank(String value) {

        return value == null || value.trim().isEmpty();
    }

    private StudentResultResponse convertToResponse(
            StudentResult result) {

        List<SubjectResultResponse> subjectResponses =
                result.getSubjects()
                        .stream()
                        .map(subject -> new SubjectResultResponse(
                                subject.getId(),
                                subject.getSubjectName(),
                                subject.getSeeMarks(),
                                subject.getEseMarks(),
                                subject.getTotalMarks()
                        ))
                        .toList();

        return new StudentResultResponse(
                result.getId(),
                result.getPrn(),
                result.getStudentName(),
                result.getBranch(),
                result.getSemester(),
                result.getAcademicYear(),
                subjectResponses,
                result.getGrandTotal(),
                result.getPercentage(),
                result.getResultStatus()
        );
    }
}