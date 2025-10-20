// backend.js

async function sendNote() {
    try {
        const noteTitle = document.getElementById('noteTitle');
        const noteBody = document.getElementById('noteBody');
        const port = window.PORT || 8080;

        const note = { title: noteTitle.value, body: noteBody.value };

        const res = await fetch(`http://localhost:${port}/add-note`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });

        const data = await res.json();
        if (data.success) {
            console.log("✅ Заметка успешно сохранена!");
            return data.note.ID
        } else {
            console.error("❌ Ошибка при добавлении:", data.err);
        }
    } catch (err) {
        console.error("⚠️ Fetch error (sendNote):", err);
    }
}

async function deleteNote(msg_id) {
    try {
        const port = window.PORT || 8080;
        const res = await fetch(`http://localhost:${port}/delete-note`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ msg_id })
        });

        const text = await res.text();
        if (!text) {
            console.warn("⚠️ Сервер не вернул ответ");
            return;
        }

        const data = JSON.parse(text);
        if (data.success) {
            document.querySelector(`.note-item[data-id="${msg_id}"]`)?.remove();
            console.log("🗑️ Заметка удалена");
        } else {
            console.error("❌ Ошибка удаления:", data.err);
        }
    } catch (err) {
        console.error("⚠️ Fetch error (deleteNote):", err);
    }
}

async function editNote(msg_id, title, body) {
    try {
        const port = window.PORT || 8080;
        const note = { msg_id, title, body };
        console.log(note)
        const res = await fetch(`http://localhost:${port}/edit-note`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });

        const text = await res.text();
        if (!text) {
            console.warn("⚠️ Сервер не вернул данных при редактировании");
            return;
        }

        const data = JSON.parse(text);
        if (data.success) {
            console.log("💾 Заметка обновлена успешно!");
        } else {
            console.error("❌ Ошибка редактирования:", data.err);
        }
    } catch (err) {
        console.error("⚠️ Fetch error (editNote):", err);
    }
}

export { sendNote, deleteNote, editNote };
