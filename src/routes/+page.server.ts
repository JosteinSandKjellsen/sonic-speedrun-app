// src/routes/+page.server.ts

import type { PageServerLoad, Actions } from './$types';
import { getTopScores, addScore, deleteScore } from '$lib/database';
import { fail } from '@sveltejs/kit';

const DELETE_PASSWORD = "BouvetPingviner";

export const load = (async () => {
  const scores = await getTopScores();
  return { 
    scores: scores.map(score => ({
      ...score,
      time: Number(score.time)
    }))
  };
}) satisfies PageServerLoad;

export const actions = {
  addScore: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const minutes = parseInt(data.get('minutes') as string);
    const seconds = parseInt(data.get('seconds') as string);
    const milliseconds = parseInt(data.get('milliseconds') as string);

    if (!name || name.length > 100) {
      return fail(400, { error: 'Invalid name' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
      return fail(400, { error: 'Invalid email' });
    }

    if (isNaN(minutes) || minutes < 0) {
      return fail(400, { error: 'Invalid minutes' });
    }

    if (isNaN(seconds) || seconds < 0 || seconds > 59) {
      return fail(400, { error: 'Invalid seconds' });
    }

    if (isNaN(milliseconds) || milliseconds < 0 || milliseconds > 999) {
      return fail(400, { error: 'Invalid milliseconds' });
    }

    const time = (minutes * 60000) + (seconds * 1000) + milliseconds;

    try {
      await addScore(name, email, time);
      return { success: true };
    } catch (error) {
      console.error('Error adding score:', error);
      return fail(500, { error: 'Internal server error' });
    }
  },

  deleteScore: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get('id') as string);
    const password = data.get('password')?.toString();

    if (isNaN(id) || id < 1) {
      return fail(400, { error: 'Invalid score ID' });
    }

    if (password !== DELETE_PASSWORD) {
      return fail(403, { error: 'Incorrect password' });
    }

    try {
      await deleteScore(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting score:', error);
      return fail(500, { error: 'Internal server error' });
    }
  }
} satisfies Actions;