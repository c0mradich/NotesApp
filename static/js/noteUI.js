import { editNote } from "./backend.js";

const titleEl = document.querySelector("header input");
const bodyEl = document.querySelector("#noteBody");
const BackBtn = document.querySelector("#BackBtn");
const SaveBtn = document.querySelector("#SaveBtn");

// ====== Подгрузка данных ======
const title_info = sessionStorage.getItem("msg_title");
const body_info = sessionStorage.getItem("msg_body");

if (title_info) titleEl.value = title_info;
if (body_info) bodyEl.value = body_info;

// fallback – загрузка с сервера, если нет sessionStorage
if (!title_info || !body_info) {
    const msg_id = sessionStorage.getItem("msg_id");
    if (msg_id) {
        fetch(`/get-note/${msg_id}`)
            .then(res => res.json())
            .then(data => {
                titleEl.value = data.title || "";
                bodyEl.value = data.body || "";
            })
            .catch(err => console.error("Ошибка загрузки заметки:", err));
    }
}

// ====== Кнопки ======
BackBtn.addEventListener("click", () => {
    window.location.href = `http://localhost:8080/`;
});

SaveBtn.addEventListener("click", async () => {
    const msg_id = sessionStorage.getItem("msg_id");
    const msg_title = titleEl.value.trim();
    const msg_body = bodyEl.value.trim();

    if (!msg_title && !msg_body) {
        console.warn("⚠️ Пустая заметка — не сохраняем");
        return;
    }

    await editNote(msg_id, msg_title, msg_body);
    console.log("✅ Изменения отправлены на сервер");
    // Back to main menu
    window.location.href = `http://localhost:8080/`;
});
