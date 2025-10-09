package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"html/template"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// структура для передачи данных в шаблон
type PageData struct {
	Notes []Note
	PORT  int
}

func main() {
	// порт через флаг
	portVal := flag.Int("port", 8080, "Port")
	flag.Parse()
	port := fmt.Sprintf(":%d", *portVal)

	// роутер
	r := chi.NewRouter()
	r.Use(middleware.Recoverer)

	// главная страница
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		tmpl, err := template.ParseFiles("static/html/index.html")
		if err != nil {
			http.Error(w, "Ошибка загрузки шаблона", http.StatusInternalServerError)
			fmt.Println("Parse template error:", err)
			return
		}

		// читаем заметки
		notes, err := ReadNotes("data.json")
		if err != nil {
			fmt.Println("Ошибка чтения заметок:", err)
			notes = []Note{}
		}

		data := PageData{Notes: notes, PORT: *portVal}
		if err := tmpl.Execute(w, data); err != nil {
			http.Error(w, "Ошибка рендеринга шаблона", http.StatusInternalServerError)
			fmt.Println("Template execute error:", err)
		}
	})

	r.Post("/add-note", func(w http.ResponseWriter, r *http.Request) {
		var noteFront Note_Front
		if err := json.NewDecoder(r.Body).Decode(&noteFront); err != nil {
			http.Error(w, "Ошибка декодирования JSON", http.StatusBadRequest)
			return
		}

		newNote, err := AddNoteSimple("data.json", noteFront)
		if err != nil {
			http.Error(w, "Ошибка сохранения заметки", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]any{
			"success": true,
			"note":    newNote,
		})
	})

	r.Post("/delete-note", func(w http.ResponseWriter, r *http.Request) {

	})

	// статика (css/js)
	fs := http.FileServer(http.Dir("./static"))
	r.Handle("/static/*", http.StripPrefix("/static/", fs))

	// дебаг
	fmt.Println("Server is running on port", port)
	fmt.Println("⚠️ Usage: go run main.go --port=8080")

	// старт сервера
	if err := http.ListenAndServe(port, r); err != nil {
		fmt.Println("Server error:", err)
	}
}
