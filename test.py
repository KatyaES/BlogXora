first = [1, 2, 3, 4, 4, 4]
second = [2, 4]

def func(a, b):
    return [i for i in a if i not in second]


if __name__ == '__main__':
    print(func(first, second))