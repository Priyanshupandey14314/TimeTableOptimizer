package com.timemaster.timetableoptimizer;

import com.timemaster.timetableoptimizer.model.Subject;
import com.timemaster.timetableoptimizer.model.Teacher;
import com.timemaster.timetableoptimizer.repository.SubjectRepository;
import com.timemaster.timetableoptimizer.repository.TeacherRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class SubjectTeacherMappingTest {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Test
    public void testSubjectTeacherMapping() {
        // Create and save a teacher
        Teacher teacher = new Teacher();
        teacher.setName("John Doe");
        teacher.setMaxHoursPerDay(4);
        teacher.setMaxHoursPerWeek(20);
        teacher = teacherRepository.save(teacher);

        // Create and save a subject with the teacher
        Subject subject = new Subject();
        subject.setName("Mathematics");
        subject.setCode("MATH101");
        subject.setTeacher(teacher);
        subject = subjectRepository.save(subject);

        // Retrieve the subject and verify the teacher
        Subject retrievedSubject = subjectRepository.findById(subject.getId()).orElse(null);
        assertNotNull(retrievedSubject);
        assertNotNull(retrievedSubject.getTeacher(), "Teacher should not be null");
        assertEquals(teacher.getId(), retrievedSubject.getTeacher().getId(), "Teacher ID should match");
    }
}
