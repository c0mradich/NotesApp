    const input = document.getElementById('noteInput');
    const btn = document.getElementById('addNoteBtn');
    const container = document.getElementById('notesContainer');

    function createNote(text) {
      if (!text) return;

      const note = document.createElement('div');
      note.className = 'note';
      note.textContent = text;

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '❌';
      deleteBtn.onclick = () => container.removeChild(note);

      note.appendChild(deleteBtn);
      container.appendChild(note);
    }

    btn.addEventListener('click', () => {
      createNote(input.value);
      input.value = '';
      input.focus();
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        createNote(input.value);
        input.value = '';
      }
    });