package com.result.vitsemesterresult.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResultResponse {

    private Long id;

    private String subjectName;

    private Integer seeMarks;

    private Integer eseMarks;

    private Integer totalMarks;
}