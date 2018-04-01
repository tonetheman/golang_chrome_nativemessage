package main

import (
	"bytes"
	"encoding/binary"
	"log"
	"os"
)

func stdinRead() {
	log.Println("stdinRead started")

	// allocate 4 bytes
	var sizeBuffer = make([]byte, 4)
	// read 4 bytes - BLOCKS
	bytesRead, err := os.Stdin.Read(sizeBuffer)
	if err != nil {
		// err!
		log.Println(err)
	}
	if bytesRead != 4 {
		// err!
		log.Println("bytesRead is not 4!", bytesRead)
	} else {
		log.Println("got 4 bytes!")
	}
	// read the bytes and determine the incoming
	// message size to read
	// use little endian
	var dest int32
	binary.Read(bytes.NewReader(sizeBuffer), binary.LittleEndian, &dest)
	log.Println("now need to read this many bytes", dest)
	// make a new byte buffer that will
	// hold the rest of the incoming message
	var buffer = make([]byte, dest)

	// read this could block but since
	// we know the data is coming it should not
	// block
	log.Println("about to read real message...")
	bytesRead, err = os.Stdin.Read(buffer)
	if err != nil {
		// err
		log.Println(err)
	}
	if bytesRead != int(dest) {
		// err
		log.Println("bytedRead not expected", bytesRead, dest)
	} else {
		log.Println("got the message!", buffer)
	}

	// TODO: need to return
	// incoming message somewhere
}

func main() {
	f, err := os.OpenFile("log.txt", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		// TODO: where to log?
	}
	defer f.Close()
	// setup file log
	log.SetOutput(f)
	log.Println("started...")
	stdinRead()
	stdinRead()
	log.Println("fin")
}
