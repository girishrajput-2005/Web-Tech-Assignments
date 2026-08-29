package com.result.vitsemesterresult.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subject_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String subjectName;

    @Column(nullable = false)
    private Integer seeMarks;

    @Column(nullable = false)
    private Integer eseMarks;

    @Column(nullable = false)
    private Integer totalMarks;
}