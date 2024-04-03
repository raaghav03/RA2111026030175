export const isPrime = (num: number): boolean => {
    if (num < 2) {
      return false;
    }
  
    if (num === 2 || num === 3) {
      return true;
    }
  
    if (num % 2 === 0 || num % 3 === 0) {
      return false;
    }
  
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) {
        return false;
      }
    }
  
    return true;
  };
  
  const fibonacciSequence: number[] = [0, 1];
  
  const calculateFibonacci = (n: number): number => {
    if (n < 2) {
      return fibonacciSequence[n];
    }
  
    for (let i = 2; i <= n; i++) {
      const nextFibonacci = fibonacciSequence[i - 1] + fibonacciSequence[i - 2];
      fibonacciSequence.push(nextFibonacci);
    }
  
    return fibonacciSequence[n];
  };
  
  export const isFibonacci = (num: number): boolean => {
    const maxFibonacci = calculateFibonacci(50); // Adjust the limit as needed
    return fibonacciSequence.includes(num) && num <= maxFibonacci;
  };
  
  export const isEven = (num: number): boolean => {
    return num % 2 === 0;
  };
  
  export const isRandom = (num: number): boolean => {
    return true;
  };