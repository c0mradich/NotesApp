package main

import (
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
}

func main() {
	// порт через флаг
	portVal := flag.Int("port", 8080, "Port")
	flag.Parse()
	port := fmt.Sprintf(":%d", *portVal)

	// читаем заметки
	notes, err := ReadNotes("data.json")
	if err != nil {
		fmt.Println("Ошибка чтения заметок:", err)
		notes = []Note{}
	}

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

		data := PageData{Notes: notes}
		if err := tmpl.Execute(w, data); err != nil {
			http.Error(w, "Ошибка рендеринга шаблона", http.StatusInternalServerError)
			fmt.Println("Template execute error:", err)
		}
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
