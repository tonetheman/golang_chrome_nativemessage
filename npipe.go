package main

import (
	"fmt"

	npipe "gopkg.in/natefinch/npipe.v2"
)

func main() {
	conn, err := npipe.Dial(`\\.\pipe\test_pipe`)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("got a connect!", conn)
	}
	//fmt.Fprintf(conn, "Hi server!\n")
	var buffer = make([]byte, 4096)
	bytesRead, err := conn.Read(buffer)
	fmt.Println("bytes read:", bytesRead, buffer)
	conn.Close()

}
