def solution(number):
    return sum(i for i in range(number) if i % 3 or i % 5)

print(solution(6))