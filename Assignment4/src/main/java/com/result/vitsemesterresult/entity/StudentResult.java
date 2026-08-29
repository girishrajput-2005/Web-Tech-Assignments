package com.result.vitsemesterresult.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "student_results",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_prn_semester_year",
            columnNames = {"prn", "semester", "academic_year"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String prn;

    @Column(nullable = false, length = 100)
    private String studentName;

    @Column(nullable = false, length = 100)
    private String branch;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false, length = 20)
    private String academicYear;

    @OneToMany(
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @OrderBy("id ASC")
    private List<SubjectResult> subjects = new ArrayList<>();

    @Column(nullable = false)
    private Integer grandTotal;

    @Column(nullable = false)
    private Double percentage;

    @Column(nullable = false, length = 20)
    private String resultStatus;
}