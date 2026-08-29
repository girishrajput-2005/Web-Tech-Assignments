package com.result.vitsemesterresult.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentResultResponse {

    private Long id;

    private String prn;

    private String studentName;

    private String branch;

    private Integer semester;

    private String academicYear;

    private List<SubjectResultResponse> subjects;

    private Integer grandTotal;

    private Double percentage;

    private String resultStatus;
}