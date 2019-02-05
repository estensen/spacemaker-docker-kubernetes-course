package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
)

type Polygon struct {
	X int  `json:"x"`
	Y int  `json:"y"`
	Dx int `json:"dx"`
	Dy int `json:"dy"`
	Dz int `json:"dz"`
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func randomHandler(w http.ResponseWriter, r *http.Request) {
	Polygons := make([]Polygon, 0, 2)
	Polygons = append(Polygons, Polygon{0, 0, 20, 20, rand.Intn( 20)})
	Polygons = append(Polygons, Polygon{40, 40, 20, 20, rand.Intn( 20)})

	respondWithJSON(w, http.StatusOK, Polygons)
}

func main() {
	println("Running on 8000")
	http.HandleFunc("/", randomHandler)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
