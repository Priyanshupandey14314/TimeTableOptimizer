package com.timemaster.timetableoptimizer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.timemaster.timetableoptimizer.model.Subject;
import com.timemaster.timetableoptimizer.model.Teacher;
import com.timemaster.timetableoptimizer.services.SubjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SubjectController.class)
public class SubjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubjectService subjectService;

    @Test
    public void testCreateSubjectWithTeacherIdAsString() throws Exception {
        // Mock the service
        when(subjectService.addSubject(any(Subject.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // JSON payload with teacher ID as string (simulating frontend)
        String jsonPayload = "{\"name\":\"Math\",\"code\":\"M101\",\"teacher\":{\"id\":\"1\"}}";

        mockMvc.perform(post("/api/subjects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isOk());

        // Verify that the service was called
        verify(subjectService).addSubject(any(Subject.class));
    }
}
