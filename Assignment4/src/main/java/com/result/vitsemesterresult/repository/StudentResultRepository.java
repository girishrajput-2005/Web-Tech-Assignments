package com.result.vitsemesterresult.repository;

import com.result.vitsemesterresult.entity.StudentResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {

    List<StudentResult> findByPrnIgnoreCaseOrderBySemesterAsc(String prn);

    Optional<StudentResult> findByPrnAndSemesterAndAcademicYear(
        String prn,
        Integer semester,
        String academicYear
    );
}