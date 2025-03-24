package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
)

// ReducedProduct defines the structure for the selected properties
type ReducedProduct struct {
	Code                string             `json:"code"`
	ProductName         string             `json:"product_name"`
	Brands              *string            `json:"brands,omitempty"`
	Nutriments          map[string]float64 `json:"nutriments"`
	ImageURL            *string            `json:"image_url,omitempty"`
	ProductQuantity     *string            `json:"product_quantity,omitempty"`
	ProductQuantityUnit *string            `json:"product_quantity_unit,omitempty"`
}

func countLines(filename string) (int, error) {
	file, err := os.Open(filename)
	if err != nil {
		return 0, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	// Increase buffer size
	buf := make([]byte, 0, 64*1024)
	scanner.Buffer(buf, 1024*1024*50) // max buffer size of 50MB
	lineCount := 0
	for scanner.Scan() {
		lineCount++
	}
	return lineCount, scanner.Err()
}

func main() {
	filename := "./openfoodapi_dump.jsonl"
	outputFilename := "out1.jsonl"

	// lineCount, err := countLines(filename)
	// if err != nil {
	// 	fmt.Println("Error counting lines:", err)
	// 	return
	// }

	// fmt.Println("Total lines in the file:", lineCount)

	// if lineCount < 3 {
	// 	fmt.Println("File has less than 3 lines. Exiting.")
	// 	return
	// }

	file, err := os.Open(filename)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	outputFile, err := os.Create(outputFilename)
	if err != nil {
		fmt.Println("Error creating output file:", err)
		return
	}
	defer outputFile.Close()

	scanner := bufio.NewScanner(file)
	// Increase buffer size
	buf := make([]byte, 0, 64*1024)
	scanner.Buffer(buf, 1024*1024*50) // max buffer size of 50MB

	count := 0

	for scanner.Scan() {
		// if count >= 3 {
		// 	break // Process only the first 3 lines
		// }

		if count%1000 == 0 {
			fmt.Println("Processed", count, "lines")
		}

		line := scanner.Text()

		var product map[string]interface{}
		if err := json.Unmarshal([]byte(line), &product); err != nil {
			fmt.Println("Error unmarshaling JSON:", err)
			continue
		}

		// Extract ingredients names
		var ingredients []string
		if ingr, ok := product["ingredients"].([]interface{}); ok {
			for _, i := range ingr {
				if ing, ok := i.(map[string]interface{}); ok {
					if text, ok := ing["text"].(string); ok {
						ingredients = append(ingredients, text)
					}
				}
			}
		}

		// Extract the nutriments
		nutriments, ok := product["nutriments"].(map[string]interface{})
		if !ok {
			nutriments = make(map[string]interface{})
		}

		// Filter nutriments values to float64
		nutrimentsFloat := make(map[string]float64)

		if energy, ok := nutriments["energy-kcal_100g"].(float64); ok {
			nutrimentsFloat["energy-kcal_100g"] = energy
		}
		if fat, ok := nutriments["fat_100g"].(float64); ok {
			nutrimentsFloat["fat_100g"] = fat
		}
		if carbs, ok := nutriments["carbohydrates_100g"].(float64); ok {
			nutrimentsFloat["carbohydrates_100g"] = carbs
		}
		if proteins, ok := nutriments["proteins_100g"].(float64); ok {
			nutrimentsFloat["proteins_100g"] = proteins
		}

		var code, productName string
		var brands, imageURL, productQuantity, productQuantityUnit *string

		if val, ok := product["code"].(string); ok {
			code = val
		}
		if val, ok := product["product_name"].(string); ok {
			productName = val
		}

		if val, ok := product["brands"].(string); ok {
			brands = &val
		}
		if val, ok := product["image_url"].(string); ok {
			imageURL = &val
		}
		if val, ok := product["product_quantity"].(string); ok {
			productQuantity = &val
		}
		if val, ok := product["product_quantity_unit"].(string); ok {
			productQuantityUnit = &val
		}

		reducedProduct := ReducedProduct{
			Code:                code,
			ProductName:         productName,
			Brands:              brands,
			Nutriments:          nutrimentsFloat,
			ImageURL:            imageURL,
			ProductQuantity:     productQuantity,
			ProductQuantityUnit: productQuantityUnit,
		}

		// Marshal the reduced product back to JSON
		reducedProductJSON, err := json.Marshal(reducedProduct)
		if err != nil {
			fmt.Println("Error marshaling reduced product:", err)
			continue
		}

		// Write to the output file
		_, err = outputFile.WriteString(string(reducedProductJSON) + "\n")
		if err != nil {
			fmt.Println("Error writing to output file:", err)
			return
		}

		count++
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading file:", err)
	}

	fmt.Println("Successfully processed and saved to", outputFilename)
}
