<!-- src/routes/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { slide } from 'svelte/transition';
  
    interface Score {
      id: number;
      name: string;
      email: string;
      time: number;
      rings: number;
    }
  
    export let data: { scores: Score[] };
    $: scores = data.scores;
    
    let showPopover = false;
    let showDeleteConfirm = false;
    let scoreToDelete: number | null = null;
    let deletePassword = '';
  
    function togglePopover(): void {
      showPopover = !showPopover;
    }
  
    function formatTime(timeInSeconds: number): string {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  
    function showDeleteConfirmation(id: number): void {
      scoreToDelete = id;
      showDeleteConfirm = true;
    }
  
    function cancelDelete(): void {
      showDeleteConfirm = false;
      scoreToDelete = null;
      deletePassword = '';
    }
  
    let form: HTMLFormElement;
  </script>
  
  <main>
    <div class="header">
      <h1>Sonic Speedrun Scoreboard</h1>
      <h2>Green Hill Zone - Act 1</h2>
    </div>
    
    <div class="scoreboard">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Time (mm:ss)</th>
            <th>Rings</th>
            <th></th> <!-- Empty header for delete button column -->
          </tr>
        </thead>
        <tbody>
          {#each scores as score, i}
            <tr>
              <td>{i + 1}</td>
              <td>{score.name}</td>
              <td>{formatTime(score.time)}</td>
              <td>{score.rings}</td>
              <td>
                <button class="delete-button" on:click={() => showDeleteConfirmation(score.id)}>×</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  
    <button class="add-button" on:click={togglePopover}>+</button>
  
    {#if showPopover}
      <div class="popover" transition:slide>
        <button class="close-button" on:click={togglePopover}>×</button>
        <h2>Add New Score</h2>
        <form
          method="POST"
          action="?/addScore"
          use:enhance={() => {
            return async ({ result }) => {
              if (result.type === 'success') {
                await invalidateAll();
                showPopover = false;
                form.reset();
              }
            };
          }}
          bind:this={form}
        >
          <label>
            Name:
            <input name="name" type="text" required>
          </label>
          <label>
            Email:
            <input name="email" type="email" required>
          </label>
          <div class="time-input">
            <label>
              Minutes:
              <input name="minutes" type="number" min="0" required>
            </label>
            <label>
              Seconds:
              <input name="seconds" type="number" min="0" max="59" step="1" required>
            </label>
          </div>
          <label>
            Rings:
            <input name="rings" type="number" required>
          </label>
          <button type="submit">Add Score</button>
        </form>
      </div>
    {/if}
  
    {#if showDeleteConfirm}
      <div class="popover" transition:slide>
        <h2>Confirm Delete</h2>
        <form
          method="POST"
          action="?/deleteScore"
          use:enhance={() => {
            return async ({ result }) => {
              if (result.type === 'success') {
                await invalidateAll();
                cancelDelete();
              } else if (result.type === 'failure') {
                alert('Delete failed. Please check the password and try again.');
              }
            };
          }}
        >
          <input type="hidden" name="id" value={scoreToDelete}>
          <label>
            Enter password to delete:
            <input type="password" name="password" bind:value={deletePassword} required>
          </label>
          <div class="button-group">
            <button type="submit">Confirm Delete</button>
            <button type="button" on:click={cancelDelete}>Cancel</button>
          </div>
        </form>
      </div>
    {/if}
  </main>
  
  <style>
    :global(body) {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #0082c8; /* Sonic blue */
      color: white;
      background-image: 
        linear-gradient(45deg, #0082c8 25%, transparent 25%), 
        linear-gradient(-45deg, #0082c8 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #0082c8 75%), 
        linear-gradient(-45deg, transparent 75%, #0082c8 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    }
  
    main {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      min-height: 100vh;
    }
  
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-top: 20px;
    }
  
    h1 {
      color: #ffd700; /* Gold color for Sonic's rings */
      font-size: 2.5em;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  
    h2 {
      color: #90ee90; /* Light green for Green Hill Zone */
    }
  
    .scoreboard {
      background-color: rgba(255, 255, 255, 0.2);
      padding: 20px;
      margin-bottom: 20px;
    }
  
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 10px;
    }
  
    th, td {
      padding: 10px;
      text-align: left;
    }
  
    th {
      background-color: #ff6347; /* Tomato red, inspired by Sonic's shoes */
      color: white;
      position: sticky;
      top: 0;
    }
  
    tr:nth-child(even) {
      background-color: rgba(255, 255, 255, 0.1);
    }
  
    .add-button, .delete-button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #ff6347;
      color: white;
      font-size: 18px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
      padding: 0;
      line-height: 1;
    }
  
    .add-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      font-size: 30px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
  
    .add-button:hover, .delete-button:hover {
      background-color: #ff4500;
    }
  
    .popover {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(255, 255, 255, 0.95);
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      color: #333;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }
  
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 24px;
      color: #ff6347;
      cursor: pointer;
      padding: 5px;
      line-height: 1;
    }
  
    .close-button:hover {
      color: #ff4500;
    }
  
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  
    label {
      display: flex;
      flex-direction: column;
      color: #0082c8;
      font-size: 1.1em;
    }
  
    input {
      padding: 10px;
      border: 1px solid #0082c8;
      border-radius: 5px;
      background-color: white;
      font-size: 1em;
    }
  
    .time-input {
      display: flex;
      gap: 10px;
    }
  
    .time-input label {
      flex: 1;
    }
  
    button[type="submit"] {
      padding: 12px;
      background-color: #ff6347;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      font-size: 1.1em;
    }
  
    button[type="submit"]:hover {
      background-color: #ff4500;
    }
  
    .button-group {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  
    .button-group button {
      flex: 1;
      margin: 0 5px;
    }
  </style>