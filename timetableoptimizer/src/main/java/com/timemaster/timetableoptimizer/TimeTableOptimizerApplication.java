package com.timemaster.timetableoptimizer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TimeTableOptimizerApplication {
	public static void main(String[] args) {
		SpringApplication.run(TimeTableOptimizerApplication.class, args);
		System.out.println("Spring boot backend started");
	}

}
