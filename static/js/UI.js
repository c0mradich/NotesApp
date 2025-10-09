// UI.js
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openNoteForm');
    const modal = document.getElementById('noteModal');
    const modalContent = document.querySelector('.note-modal-content');
    const closeBtn = document.getElementById('closeNoteBtn');
    const saveBtn = document.getElementById('saveNoteBtn');
    const notesContainer = document.getElementById('notesContainer');

    // Открыть модалку
    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    // Закрыть модалку
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
    if (!modalContent.contains(e.target)) {
        modal.classList.add('hidden');
    }
});

    // Сохранить заметку
    saveBtn.addEventListener('click', () => {
        const title = document.getElementById('noteTitle').value.trim();
        const body = document.getElementById('noteBody').value.trim();

        if (!title || !body) {
            alert('Введите заголовок и тело заметки!');
            return;
        }

        // Создаём DOM-элемент заметки
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note-item');
        const dateStr = new Date().toLocaleString();

        noteDiv.innerHTML = `
            <h3>${title}</h3>
            <p>${body}</p>
            <span>${dateStr}</span>
        `;

        notesContainer.prepend(noteDiv); // добавляем сверху

        // Закрываем модалку и очищаем форму
        modal.classList.add('hidden');
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteBody').value = '';
    });
});
