package com.vit.resultportal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "student_results")
public class StudentResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String studentName;

    @Column(nullable = false, length = 30)
    private String prn;

    @Column(nullable = false, length = 50)
    private String branch;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false, length = 100)
    private String subject1;

    private Double mse1;
    private Double ese1;

    @Column(nullable = false, length = 100)
    private String subject2;

    private Double mse2;
    private Double ese2;

    @Column(nullable = false, length = 100)
    private String subject3;

    private Double mse3;
    private Double ese3;

    @Column(nullable = false, length = 100)
    private String subject4;

    private Double mse4;
    private Double ese4;

    public StudentResult() {}

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getStudentName() { return studentName; }
    public String getPrn() { return prn; }
    public String getBranch() { return branch; }
    public Integer getSemester() { return semester; }
    public String getSubject1() { return subject1; }
    public Double getMse1() { return mse1; }
    public Double getEse1() { return ese1; }
    public String getSubject2() { return subject2; }
    public Double getMse2() { return mse2; }
    public Double getEse2() { return ese2; }
    public String getSubject3() { return subject3; }
    public Double getMse3() { return mse3; }
    public Double getEse3() { return ese3; }
    public String getSubject4() { return subject4; }
    public Double getMse4() { return mse4; }
    public Double getEse4() { return ese4; }

    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public void setPrn(String prn) { this.prn = prn; }
    public void setBranch(String branch) { this.branch = branch; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public void setSubject1(String subject1) { this.subject1 = subject1; }
    public void setMse1(Double mse1) { this.mse1 = mse1; }
    public void setEse1(Double ese1) { this.ese1 = ese1; }
    public void setSubject2(String subject2) { this.subject2 = subject2; }
    public void setMse2(Double mse2) { this.mse2 = mse2; }
    public void setEse2(Double ese2) { this.ese2 = ese2; }
    public void setSubject3(String subject3) { this.subject3 = subject3; }
    public void setMse3(Double mse3) { this.mse3 = mse3; }
    public void setEse3(Double ese3) { this.ese3 = ese3; }
    public void setSubject4(String subject4) { this.subject4 = subject4; }
    public void setMse4(Double mse4) { this.mse4 = mse4; }
    public void setEse4(Double ese4) { this.ese4 = ese4; }
}
