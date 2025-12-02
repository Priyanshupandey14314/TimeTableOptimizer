package com.timemaster.timetableoptimizer.ga;

import com.timemaster.timetableoptimizer.model.*;
import java.util.*;

public class Chromosome {

    private List<Gene> genes = new ArrayList<>();
    private double fitness = -1; // fitness is computed later
    private Random random = new Random();

    // Constructor to generate a RANDOM timetable
    public Chromosome(List<ClassSection> classSections,
                      List<Subject> subjects,
                      List<Teacher> teachers,
                      List<Room> rooms,
                      List<TimeSlot> timeSlots) {

        for (ClassSection section : classSections) {
            for (Subject subject : subjects) {

                // Find teachers who can teach this subject
                List<Teacher> subjectTeachers = new ArrayList<>();
                for (Teacher teacher : teachers) {
                    if (teacher.getSubjects().contains(subject)) {
                        subjectTeachers.add(teacher);
                    }
                }

                // If no teacher exists for subject → skip (or handle penalty later)
                Teacher chosenTeacher = subjectTeachers.isEmpty()
                        ? null
                        : subjectTeachers.get(random.nextInt(subjectTeachers.size()));

                Room chosenRoom = rooms.get(random.nextInt(rooms.size()));
                TimeSlot chosenSlot = timeSlots.get(random.nextInt(timeSlots.size()));

                genes.add(new Gene(section, subject, chosenTeacher, chosenRoom, chosenSlot));
            }
        }
    }

    public List<Gene> getGenes() {
        return genes;
    }

    public double getFitness() {
        return fitness;
    }

    public void setFitness(double fitness) {
        this.fitness = fitness;
    }

    // Deep clone
    public Chromosome copy() {
        Chromosome clone = new Chromosome();
        for (Gene g : this.genes) {
            Gene newGene = new Gene(
                    g.getClassSection(),
                    g.getSubject(),
                    g.getTeacher(),
                    g.getRoom(),
                    g.getTimeSlot()
            );
            clone.genes.add(newGene);
        }
        clone.fitness = this.fitness;
        return clone;
    }

    // Private constructor for internal clone
    private Chromosome() {}

    // Mutation - randomly change teacher/room/timeslot
    public void mutate(List<Teacher> teachers, List<Room> rooms, List<TimeSlot> timeSlots) {
        int index = random.nextInt(genes.size());
        Gene gene = genes.get(index);

        int choice = random.nextInt(3);

        switch (choice) {
            case 0: // change room
                gene.setRoom(rooms.get(random.nextInt(rooms.size())));
                break;
            case 1: // change timeslot
                gene.setTimeSlot(timeSlots.get(random.nextInt(timeSlots.size())));
                break;
            case 2: // change teacher
                List<Teacher> validTeachers = new ArrayList<>();
                for (Teacher t : teachers) {
                    if (t.getSubjects().contains(gene.getSubject())) {
                        validTeachers.add(t);
                    }
                }
                if (!validTeachers.isEmpty()) {
                    gene.setTeacher(validTeachers.get(random.nextInt(validTeachers.size())));
                }
                break;
        }
    }

    // Single-point crossover
    public Chromosome crossover(Chromosome other) {
        Chromosome child = new Chromosome();
        int crossoverPoint = random.nextInt(genes.size());

        for (int i = 0; i < genes.size(); i++) {
            Gene parentGene = (i < crossoverPoint) ? this.genes.get(i) : other.genes.get(i);
            // Create new Gene object to avoid reference issues
            Gene newGene = new Gene(
                    parentGene.getClassSection(),
                    parentGene.getSubject(),
                    parentGene.getTeacher(),
                    parentGene.getRoom(),
                    parentGene.getTimeSlot()
            );
            child.genes.add(newGene);
        }

        return child;
    }
}
