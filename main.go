package main

import (
	"fmt"

	"github.com/robertkrimen/otto"
)

func main() {
	// Run a go function in javascript
	vm := otto.New()

	// A simple function to double an integet
	vm.Set("double", func(call otto.FunctionCall) otto.Value {
		value, _ := call.Argument(0).ToInteger()
		result, _ := vm.ToValue(value * 2)
		return result
	})

	// Run some code that uses our function
	vm.Run(`
		var test = double(2);
	`)

	// Print the output
	value, _ := vm.Get("test")
	fmt.Println(value)

	// Run a javascipt function in go
	vm2 := otto.New()

	// Create our function
	vm2.Run(`
		var double = function(number) {
			return number * 2
		}
	`)

	// Run our function
	value2, _ := vm2.Run("double(4)")
	fmt.Println(value2)
}
