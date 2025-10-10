package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"
)

type Note struct {
	ID       int       `json:"id"`
	Title    string    `json:"title"`
	Body     string    `json:"body"`
	DateTime time.Time `json:"datetime"` // для примера
}

type Note_Front struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

type MSG_ID struct {
	Msg_id string `json:"msg_id"`
}

func ReadNotes(filePath string) ([]Note, error) {
	// Открываем файл для чтения/записи, создаём если нет
	file, err := os.OpenFile(filePath, os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		return nil, fmt.Errorf("не удалось открыть файл: %w", err)
	}
	defer file.Close()

	decoder := json.NewDecoder(file)

	// Если файл пустой — сразу возвращаем пустой слайс
	info, _ := file.Stat()
	if info.Size() == 0 {
		return []Note{}, nil
	}

	// Читаем первый токен (ожидаем массив)
	tok, err := decoder.Token()
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения токена: %w", err)
	}
	delim, ok := tok.(json.Delim)
	if !ok || delim != '[' {
		return nil, fmt.Errorf("ожидался JSON-массив")
	}

	var notes []Note
	for decoder.More() {
		var note Note
		err := decoder.Decode(&note)
		if err != nil {
			// Пропускаем битые объекты, но логируем
			fmt.Println("Ошибка при чтении объекта, пропускаем:", err)
			continue
		}
		notes = append(notes, note)
	}

	return notes, nil
}

func AddNoteSimple(filePath string, noteFront Note_Front) (Note, error) {
	// 1️⃣ Читаем существующие заметки
	notes, err := ReadNotes(filePath)
	if err != nil {
		notes = []Note{} // если файл пустой или битый
	}

	// 2️⃣ Создаём новую заметку
	newNote := Note{
		ID:       len(notes) + 1,
		Title:    noteFront.Title,
		Body:     noteFront.Body,
		DateTime: time.Now(),
	}

	// 3️⃣ Добавляем к массиву
	notes = append(notes, newNote)

	// 4️⃣ Сохраняем обратно напрямую
	file, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		return Note{}, fmt.Errorf("не удалось открыть файл для записи: %w", err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(notes); err != nil {
		return Note{}, fmt.Errorf("ошибка кодирования JSON: %w", err)
	}

	return newNote, nil
}

func DeleteNoteSimple(filePath string, msgID string) error {
	notes, err := ReadNotes(filePath)
	if err != nil {
		return fmt.Errorf("ошибка чтения файла: %w", err)
	}

	idInt, err := strconv.Atoi(msgID)
	if err != nil {
		return fmt.Errorf("невалидный msg_id: %s", msgID)
	}

	var updated []Note
	found := false
	for _, note := range notes {
		if note.ID == idInt {
			found = true
			continue
		}
		updated = append(updated, note)
	}

	if !found {
		return fmt.Errorf("заметка с id=%d не найдена", idInt)
	}

	file, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		return fmt.Errorf("не удалось открыть файл для записи: %w", err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(updated); err != nil {
		return fmt.Errorf("ошибка кодирования JSON: %w", err)
	}

	return nil
}
