package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
)

type Note struct {
	ID       int       `json:"id"`
	Title    string    `json:"title"`
	Body     string    `json:"body"`
	DateTime time.Time `json:"datetime"` // для примера
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
