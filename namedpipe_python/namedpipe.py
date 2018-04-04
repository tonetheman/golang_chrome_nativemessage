


def reader():
    import win32pipe, win32file
    fileHandle = win32file.CreateFile("\\\\.\\pipe\\test_pipe",
                                win32file.GENERIC_READ | win32file.GENERIC_WRITE,
                                0, None,
                                win32file.OPEN_EXISTING,
                                0, None)
    data = win32file.ReadFile(fileHandle, 4096)
    print(data)
    win32file.CloseHandle(fileHandle)

def writer():
    import win32pipe, win32file

    p = win32pipe.CreateNamedPipe(r'\\.\pipe\test_pipe',
        win32pipe.PIPE_ACCESS_DUPLEX,
        win32pipe.PIPE_TYPE_MESSAGE | win32pipe.PIPE_WAIT,
        1, 65536, 65536,300,None)

    win32pipe.ConnectNamedPipe(p, None)


    data = b"Hello Pipe"  
    win32file.WriteFile(p, data)
    win32file.CloseHandle(p)    