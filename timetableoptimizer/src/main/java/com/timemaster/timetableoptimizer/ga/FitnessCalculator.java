package com.timemaster.timetableoptimizer.ga;

import com.timemaster.timetableoptimizer.model.*;
import java.util.*;

public class FitnessCalculator {

    public static double calculateFitness(Chromosome chromosome) {
        double fitness = 1000.0; // Start with base fitness
        List<Gene> genes = chromosome.getGenes();

        // Penalty for teacher conflicts (same teacher at same time)
        fitness -= calculateTeacherConflicts(genes) * 50;

        // Penalty for room conflicts (same room at same time)
        fitness -= calculateRoomConflicts(genes) * 50;

        // Penalty for class section conflicts (same class at same time)
        fitness -= calculateClassSectionConflicts(genes) * 50;

        // Penalty for teacher availability violations
        fitness -= calculateTeacherAvailabilityViolations(genes) * 30;

        // Penalty for room capacity violations
        fitness -= calculateRoomCapacityViolations(genes) * 20;

        // Penalty for teacher workload violations
        fitness -= calculateTeacherWorkloadViolations(genes) * 25;

        // Ensure fitness is non-negative
        return Math.max(0, fitness);
    }

    private static int calculateTeacherConflicts(List<Gene> genes) {
        int conflicts = 0;
        Map<String, Set<Gene>> teacherTimeMap = new HashMap<>();

        for (Gene gene : genes) {
            if (gene.getTeacher() == null) continue;
            
            String key = gene.getTeacher().getId() + "_" + 
                        gene.getTimeSlot().getDay() + "_" + 
                        gene.getTimeSlot().getPeriodNumber();
            
            teacherTimeMap.putIfAbsent(key, new HashSet<>());
            Set<Gene> existing = teacherTimeMap.get(key);
            
            if (!existing.isEmpty()) {
                conflicts++;
            }
            existing.add(gene);
        }

        return conflicts;
    }

    private static int calculateRoomConflicts(List<Gene> genes) {
        int conflicts = 0;
        Map<String, Set<Gene>> roomTimeMap = new HashMap<>();

        for (Gene gene : genes) {
            String key = gene.getRoom().getId() + "_" + 
                        gene.getTimeSlot().getDay() + "_" + 
                        gene.getTimeSlot().getPeriodNumber();
            
            roomTimeMap.putIfAbsent(key, new HashSet<>());
            Set<Gene> existing = roomTimeMap.get(key);
            
            if (!existing.isEmpty()) {
                conflicts++;
            }
            existing.add(gene);
        }

        return conflicts;
    }

    private static int calculateClassSectionConflicts(List<Gene> genes) {
        int conflicts = 0;
        Map<String, Set<Gene>> classTimeMap = new HashMap<>();

        for (Gene gene : genes) {
            String key = gene.getClassSection().getId() + "_" + 
                        gene.getTimeSlot().getDay() + "_" + 
                        gene.getTimeSlot().getPeriodNumber();
            
            classTimeMap.putIfAbsent(key, new HashSet<>());
            Set<Gene> existing = classTimeMap.get(key);
            
            if (!existing.isEmpty()) {
                conflicts++;
            }
            existing.add(gene);
        }

        return conflicts;
    }

    private static int calculateTeacherAvailabilityViolations(List<Gene> genes) {
        int violations = 0;

        for (Gene gene : genes) {
            if (gene.getTeacher() == null) {
                violations++;
                continue;
            }

            Teacher teacher = gene.getTeacher();
            String slotKey = gene.getTimeSlot().getDay() + "_" + gene.getTimeSlot().getPeriodNumber();
            
            if (teacher.getAvailableSlots() != null && 
                !teacher.getAvailableSlots().contains(slotKey)) {
                violations++;
            }
        }

        return violations;
    }

    private static int calculateRoomCapacityViolations(List<Gene> genes) {
        int violations = 0;

        for (Gene gene : genes) {
            if (gene.getRoom().getCapacity() < gene.getClassSection().getStudentCount()) {
                violations++;
            }
        }

        return violations;
    }

    private static int calculateTeacherWorkloadViolations(List<Gene> genes) {
        Map<String, Integer> teacherDailyHours = new HashMap<>();
        Map<Long, Integer> teacherWeeklyHours = new HashMap<>();
        int violations = 0;

        for (Gene gene : genes) {
            if (gene.getTeacher() == null) continue;

            Long teacherId = gene.getTeacher().getId();
            String day = gene.getTimeSlot().getDay();

            // Count daily hours
            String dailyKey = teacherId + "_" + day;
            teacherDailyHours.put(dailyKey, teacherDailyHours.getOrDefault(dailyKey, 0) + 1);

            // Count weekly hours
            teacherWeeklyHours.put(teacherId, teacherWeeklyHours.getOrDefault(teacherId, 0) + 1);
        }

        // Check violations
        for (Gene gene : genes) {
            if (gene.getTeacher() == null) continue;

            Teacher teacher = gene.getTeacher();
            Long teacherId = teacher.getId();
            String day = gene.getTimeSlot().getDay();
            String dailyKey = teacherId + "_" + day;

            if (teacher.getMaxHoursPerDay() > 0 && 
                teacherDailyHours.getOrDefault(dailyKey, 0) > teacher.getMaxHoursPerDay()) {
                violations++;
            }

            if (teacher.getMaxHoursPerWeek() > 0 && 
                teacherWeeklyHours.getOrDefault(teacherId, 0) > teacher.getMaxHoursPerWeek()) {
                violations++;
            }
        }

        return violations;
    }
}
