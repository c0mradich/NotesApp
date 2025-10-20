import { sendNote, deleteNote } from "./backend.js";

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openNoteForm');
    const modal = document.getElementById('noteModal');
    const modalContent = document.querySelector('.note-modal-content');
    const closeBtn = document.getElementById('closeNoteBtn');
    const saveBtn = document.getElementById('saveNoteBtn');
    const notesContainer = document.getElementById('notesContainer');
    const noteModalDelete = document.getElementById("noteModalDelete");
    const noteModalDeleteContent = document.querySelector(".note-modal-delete-content");
    const DeleteBtnSubmit = document.getElementById("DeleteBtnSubmit");
    const closeNoteBtnSubmit = document.getElementById('closeNoteBtnSubmit');

    // --- OPEN/CLOSE NOTE MODAL ---
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', e => {
        if (!modalContent.contains(e.target)) modal.classList.add('hidden');
    });

    // --- CLOSE DELETE MODAL ---
    noteModalDelete.addEventListener('click', e => {
        if (!noteModalDeleteContent.contains(e.target) || e.target === closeNoteBtnSubmit) {
            noteModalDelete.classList.add('hidden');
        }
    });

    // --- SAVE NOTE ---
    saveBtn.addEventListener('click', async () => {
        const title = document.getElementById('noteTitle').value.trim();
        const body = document.getElementById('noteBody').value.trim();

        if (!title || !body) {
            alert('Введите заголовок и тело заметки!');
            return;
        }

        // 1️⃣ Отправляем на сервер
        const note_id = await sendNote(title, body);

        // 2️⃣ Создаём DOM элемент
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note-item');
        noteDiv.dataset.id = note_id;
        const dateStr = new Date().toLocaleString();

        noteDiv.innerHTML = `
            <h3 class="note_title">${title}</h3>
            <p class="note_body">${body}</p>
            <div class="noteDesc">
                <span>${dateStr}</span>
                <div>
                    <span class="editBtn" data-id="${note_id}">Edit</span>
                    <span class="deleteBtn" data-id="${note_id}">Delete</span>
                </div>
            </div>
        `;

        notesContainer.prepend(noteDiv);

        // 3️⃣ Закрываем модалку и очищаем поля
        modal.classList.add('hidden');
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteBody').value = '';
    });

    // --- DELEGATED EVENTS FOR EDIT/DELETE ---
    notesContainer.addEventListener('click', (e) => {
        const btn = e.target;

        // 🗑 DELETE
        if (btn.classList.contains('deleteBtn')) {
            const msg_id = btn.dataset.id;
            noteModalDelete.classList.remove("hidden");
            DeleteBtnSubmit.dataset.id = msg_id;
        }

        // ✏️ EDIT
        if (btn.classList.contains('editBtn')) {
            const message_id = btn.dataset.id;
            const msg = document.querySelector(`.note-item[data-id="${message_id}"]`);
            const msg_title = msg.querySelector(".note_title").textContent;
            const msg_body = msg.querySelector(".note_body").textContent;

            sessionStorage.setItem("msg_title", msg_title);
            sessionStorage.setItem("msg_body", msg_body);
            sessionStorage.setItem("msg_id", message_id);

            window.open(`http://localhost:8080/note/${message_id}`);
        }
    });

    // --- CONFIRM DELETE ---
    DeleteBtnSubmit.addEventListener('click', async () => {
        const noteId = DeleteBtnSubmit.dataset.id;
        await deleteNote(noteId);
        document.querySelector(`.note-item[data-id="${noteId}"]`)?.remove();
        noteModalDelete.classList.add("hidden");
    });
});
