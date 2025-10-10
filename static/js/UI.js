import {sendNote, deleteNote} from "./backend.js";

// UI.js
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openNoteForm');
    const modal = document.getElementById('noteModal');
    const modalContent = document.querySelector('.note-modal-content');
    const closeBtn = document.getElementById('closeNoteBtn');
    const saveBtn = document.getElementById('saveNoteBtn');
    const notesContainer = document.getElementById('notesContainer');
    const deleteBtn = document.querySelectorAll('.deleteBtn')
    const noteModalDelete = document.getElementById("noteModalDelete")
    const noteModalDeleteContent = document.querySelector(".note-modal-delete-content")
    const DeleteBtnSubmit = document.getElementById("DeleteBtnSubmit")
    const closeNoteBtnSubmit = document.getElementById('closeNoteBtnSubmit')
    const editBtn = document.querySelectorAll(".editBtn")


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
    noteModalDelete.addEventListener('click', (e)=>{
        if (!noteModalDeleteContent.contains(e.target) || e.target == closeNoteBtnSubmit) {
            noteModalDelete.classList.add('hidden');
        }
    })

        // Сохранить заметку
    saveBtn.addEventListener('click', async () => {
        const title = document.getElementById('noteTitle').value.trim();
        const body = document.getElementById('noteBody').value.trim();

        if (!title || !body) {
            alert('Введите заголовок и тело заметки!');
            return;
        }

        // 1️⃣ Отправляем на сервер и ждём
        await sendNote();

        // 2️⃣ Создаём DOM-элемент заметки после успешного отправления
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note-item');
        const dateStr = new Date().toLocaleString();

        noteDiv.innerHTML = `
            <h3>${title}</h3>
            <p>${body}</p>
            <div class="noteDesc">
                <span>${dateStr}</span>
            <div>
              <span class="editBtn">Edit</span>
              <span class="deleteBtn"">Delete</span>
            </div>
            </div>
        `;

        notesContainer.prepend(noteDiv);

        // 3️⃣ Закрываем модалку и очищаем форму
        modal.classList.add('hidden');
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteBody').value = '';
    });

    // Delete Notes
    deleteBtn.forEach(btn => {
        btn.addEventListener('click', ()=>{
        const msg_id = btn.dataset.id
        noteModalDelete.classList.remove("hidden")
        DeleteBtnSubmit.dataset.id = msg_id
       }) 
    });

    DeleteBtnSubmit.addEventListener('click', ()=>{
        deleteNote(DeleteBtnSubmit.dataset.id)
        noteModalDelete.classList.add("hidden")
    })

    editBtn.forEach(btn=>{
        btn.addEventListener('click', ()=>{
            const message_id = btn.dataset.id;
            const msg = document.querySelector(`.note-item[data-id="${message_id}"]`)
            const msg_title = msg.querySelector(".note_title").textContent
            const msg_body = msg.querySelector(".note_body").textContent
            sessionStorage.setItem("msg_title", msg_title)
            sessionStorage.setItem("msg_body", msg_body)
            sessionStorage.setItem("msg_id", message_id)
            window.open(`http://localhost:8080/note/${message_id}`, "_blank");
        })
    })
});