package com.timemaster.timetableoptimizer.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.timemaster.timetableoptimizer.dto.TimeTableRequest;
import com.timemaster.timetableoptimizer.model.*;
import com.timemaster.timetableoptimizer.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TimetableIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ClassSectionRepository classSectionRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Clear databases to ensure clean state
        // Note: In a real prod env, use @Transactional or separate test DB
        // For this local setup, we rely on H2 or similar provided by @SpringBootTest
    }

    @Test
    void testGenerateTimetable_EndToEnd() throws Exception {
        // 1. Create Data
        Subject math = new Subject();
        math.setName("Mathematics");
        math.setCode("MATH101");
        math = subjectRepository.save(math);

        Subject physics = new Subject();
        physics.setName("Physics");
        physics.setCode("PHY101");
        physics = subjectRepository.save(physics);

        Teacher teacher = new Teacher();
        teacher.setName("John Doe");
        teacher.setSubjects(new ArrayList<>(Collections.singletonList(math)));
        teacher.getSubjects().add(physics);
        teacher = teacherRepository.save(teacher);

        Room room = new Room();
        room.setRoomNumber("101");
        room.setCapacity(30);
        room = roomRepository.save(room);

        ClassSection classSection = new ClassSection();
        classSection.setName("Class 10A");
        classSection.setStudentCount(25);
        classSection = classSectionRepository.save(classSection);

        // Create TimeSlots if not implicitly loaded (assuming empty DB start)
        if (timeSlotRepository.count() == 0) {
            TimeSlot ts1 = new TimeSlot();
            ts1.setDay("Monday");
            ts1.setStartTime("09:00");
            ts1.setEndTime("10:00");
            ts1.setPeriodNumber(1);
            timeSlotRepository.save(ts1);

            TimeSlot ts2 = new TimeSlot();
            ts2.setDay("Monday");
            ts2.setStartTime("10:00");
            ts2.setEndTime("11:00");
            ts2.setPeriodNumber(2);
            timeSlotRepository.save(ts2);
        }

        // 2. Prepare Request
        List<Long> teacherIds = new ArrayList<>();
        teacherIds.add(teacher.getId());

        List<Long> subjectIds = new ArrayList<>();
        subjectIds.add(math.getId());
        subjectIds.add(physics.getId());

        TimeTableRequest request = new TimeTableRequest();
        request.setClassSectionId(classSection.getId());
        request.setTeacherIds(teacherIds);
        request.setSubjectIds(subjectIds);

        // 3. Perform Request
        MvcResult result = mockMvc.perform(post("/api/timetable/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Timetable generated successfully")))
                .andExpect(jsonPath("$.timetable", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.fitness", greaterThanOrEqualTo(0.0)))
                .andReturn();

        // 4. Print Response for debugging
        String content = result.getResponse().getContentAsString();
        System.out.println("Timetable Response: " + content);
    }
}
