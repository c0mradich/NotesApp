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

export default sendNote