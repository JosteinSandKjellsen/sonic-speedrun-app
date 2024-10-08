// src/lib/database.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTopScores(limit: number = 100) {
  try {
    return await prisma.score.findMany({
      take: limit,
      orderBy: [
        { time: 'asc' },
        { rings: 'desc' }
      ]
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw new Error('Failed to fetch scores');
  }
}

export async function addScore(name: string, email: string, time: number, rings: number) {
  try {
    return await prisma.score.create({
      data: {
        name,
        email,
        time,
        rings
      }
    });
  } catch (error) {
    console.error('Error adding score:', error);
    throw new Error('Failed to add score');
  }
}

export async function deleteScore(id: number) {
  try {
    return await prisma.score.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting score:', error);
    throw new Error('Failed to delete score');
  }
}