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
        const key_obj = { msg_id: msg_id };

        const res = await fetch(`http://localhost:${port}/delete-note`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(key_obj)
        });

        // ✅ Проверяем, есть ли тело у ответа
        const text = await res.text();
        if (!text) {
            console.warn("Пустой ответ от сервера");
            return;
        }

        const data = JSON.parse(text);
        if (data.success) {
            document.querySelector(`.note-item[data-id="${msg_id}"]`)?.remove();
            console.log("Заметка удалена успешно!");
        } else {
            console.log("Ошибка удаления:", data.err);
        }
    } catch (err) {
        console.log("Fetch error:", err);
    }
}


export { sendNote, deleteNote };
