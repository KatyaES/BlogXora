def generator():
    yield 1
    yield 2

obj = generator()

for i in obj:
    print(next(obj))