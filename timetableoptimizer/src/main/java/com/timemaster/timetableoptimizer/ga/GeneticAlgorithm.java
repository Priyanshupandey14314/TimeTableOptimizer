package com.timemaster.timetableoptimizer.ga;

import com.timemaster.timetableoptimizer.model.*;
import java.util.*;

public class GeneticAlgorithm {

    private static final int POPULATION_SIZE = 100;
    private static final double MUTATION_RATE = 0.1;
    private static final double CROSSOVER_RATE = 0.8;
    private static final int MAX_GENERATIONS = 100;
    private static final int TOURNAMENT_SIZE = 5;
    private static final double ELITISM_RATE = 0.1; // Keep top 10% of population

    private List<ClassSection> classSections;
    private List<Subject> subjects;
    private List<Teacher> teachers;
    private List<Room> rooms;
    private List<TimeSlot> timeSlots;
    private Random random;

    public GeneticAlgorithm(List<ClassSection> classSections,
                           List<Subject> subjects,
                           List<Teacher> teachers,
                           List<Room> rooms,
                           List<TimeSlot> timeSlots) {
        this.classSections = classSections;
        this.subjects = subjects;
        this.teachers = teachers;
        this.rooms = rooms;
        this.timeSlots = timeSlots;
        this.random = new Random();
    }

    public Chromosome evolve() {
        // Initialize population
        Population population = new Population(POPULATION_SIZE, classSections, 
                                               subjects, teachers, rooms, timeSlots);

        Chromosome bestChromosome = population.getFittest();
        double bestFitness = bestChromosome.getFitness();

        // Evolution loop
        for (int generation = 0; generation < MAX_GENERATIONS; generation++) {
            Population newPopulation = new Population(new ArrayList<>());

            // Elitism: Keep best chromosomes
            int eliteCount = (int) (POPULATION_SIZE * ELITISM_RATE);
            for (int i = 0; i < eliteCount; i++) {
                newPopulation.getChromosomes().add(population.getChromosome(i).copy());
            }

            // Fill rest of population with crossover and mutation
            while (newPopulation.getChromosomes().size() < POPULATION_SIZE) {
                // Selection
                Chromosome parent1 = population.tournamentSelect(TOURNAMENT_SIZE);
                Chromosome parent2 = population.tournamentSelect(TOURNAMENT_SIZE);

                // Crossover
                Chromosome child1, child2;
                if (random.nextDouble() < CROSSOVER_RATE) {
                    child1 = parent1.crossover(parent2);
                    child2 = parent2.crossover(parent1);
                } else {
                    child1 = parent1.copy();
                    child2 = parent2.copy();
                }

                // Mutation
                if (random.nextDouble() < MUTATION_RATE) {
                    child1.mutate(teachers, rooms, timeSlots);
                }
                if (random.nextDouble() < MUTATION_RATE) {
                    child2.mutate(teachers, rooms, timeSlots);
                }

                newPopulation.getChromosomes().add(child1);
                if (newPopulation.getChromosomes().size() < POPULATION_SIZE) {
                    newPopulation.getChromosomes().add(child2);
                }
            }

            // Recalculate fitness for new population
            newPopulation.calculateFitness();
            population = newPopulation;

            // Track best solution
            Chromosome currentBest = population.getFittest();
            if (currentBest.getFitness() > bestFitness) {
                bestChromosome = currentBest.copy();
                bestFitness = currentBest.getFitness();
            }

            // Early termination if perfect solution found
            if (bestFitness >= 1000.0) {
                break;
            }
        }

        return bestChromosome;
    }
}
