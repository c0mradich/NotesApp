package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"html/template"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Note struct {
	ID       int       `json:"id"`
	Title    string    `json:"title"`
	Body     string    `json:"body"`
	DateTime time.Time `json:"datetime"`
}

func main() {
	portVal := flag.Int("port", 8080, "Port")
	flag.Parse()

	port := fmt.Sprintf(":%d", *portVal)

	r := chi.NewRouter()
	r.Use(middleware.Recoverer)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		tmpl := template.Must(template.ParseFiles("static/html/index.html"))
		tmpl.Execute(w, nil)
	})

	r.Get("/static/*", func(w http.ResponseWriter, r *http.Request) {
		path := "." + r.URL.Path
		ext := filepath.Ext(path)
		if mimeType := mime.TypeByExtension(ext); mimeType != "" {
			w.Header().Set("Content-Type", mimeType)
		}
		http.ServeFile(w, r, path)
	})

	file, err := os.OpenFile("data.json", os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	_, err = decoder.Token()
	if err != nil {
		panic(err)
	}

	count := 0
	for decoder.More() {
		var note Note
		err := decoder.Decode(&note)
		if err != nil {
			panic(err)
		}

		count++
		if count%10000 == 0 {
			fmt.Printf("Прочитано %d пользователей\n", count)
		}
	}

	fmt.Println("Server is running on port", port)
	fmt.Println("⚠️ Usage:")
	fmt.Println("  go run main.go --port=8080  // Specifies port")
	http.ListenAndServe(port, r)
}
