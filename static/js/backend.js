async function sendNote() {
    try {
        const noteTitle = document.getElementById('noteTitle')
        const noteBody = document.getElementById('noteBody')
        const port = window.PORT

        console.log("Port: ", port);  // Debugg

        const note  = {title: noteTitle.value, body: noteBody.value}
        const res = await fetch(`http://localhost:${port}/add-note`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        });

        const data = await res.json();
        if (!data.success) {
            console.log("Ошибка:", data.err);
        } else {
            console.log("Заметка успешно отправлена!");
        }
    } catch (err) {
        console.log("Fetch error:", err);
    }
}

async function deleteNote(msg_id) {
    try {
        const port = window.PORT;
        const key_obj = { id: msg_id };

        const res = await fetch(`http://localhost:${port}/delete-note`, {
            method: 'POST', // или 'DELETE', если сервер поддерживает
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(key_obj)
        });

        // 1️⃣ Удаляем заметку из DOM
        const noteElem = document.querySelector(`.note-item[data-id="${msg_id}"]`);
        noteElem.remove()

        console.log("Заметка удалена успешно!");
    } catch (err) {
        console.log("Fetch error:", err);
    }
}

export { sendNote, deleteNote };
