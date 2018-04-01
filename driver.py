
import subprocess, sys
import struct

cmd = "go run prog.go"

try:
  p = subprocess.Popen(
      cmd,
      stdin=subprocess.PIPE,
      stdout=subprocess.PIPE,
      stderr=subprocess.PIPE,
      bufsize=1,
      universal_newlines=True)
except Exception as e:
  print("Failed to start running your code. Error:")
  print(e)
  sys.exit(-1)

# print(NUM_TEST_CASES, file=p.stdin)
p.stdin.buffer.write(struct.pack("I",4))
p.stdin.buffer.write(b"tony")
p.stdin.flush()

import time
time.sleep(4)

p.stdin.buffer.write(struct.pack("I",6))
p.stdin.buffer.write(b"tonyxx")
p.stdin.flush()

time.sleep(2)
