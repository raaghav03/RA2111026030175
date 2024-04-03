import axios, { AxiosRequestConfig } from 'axios';
import { isPrime, isFibonacci, isEven, isRandom } from '../utils/numberUtils';

const WINDOW_SIZE = 10;
const TIMEOUT_DURATION = 500;
const CLIENT_ID = '25f6d7fe-e22e-47f5-8235-0bb06ee0106f';

class Deque<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  addFront(item: T): void {
    this.items.unshift(item);
    if (this.items.length > WINDOW_SIZE) {
      this.removeLast();
    }
  }

  addLast(item: T): void {
    this.items.push(item);
    if (this.items.length > WINDOW_SIZE) {
      this.removeFirst();
    }
  }

  removeFirst(): T | undefined {
    return this.items.shift();
  }

  removeLast(): T | undefined {
    return this.items.pop();
  }

  getItems(): T[] {
    return this.items;
  }
}

const numbers = new Deque<number>();

const getRequestConfig = (): AxiosRequestConfig => ({
  timeout: TIMEOUT_DURATION,
  headers: {
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTQ5NjI4LCJpYXQiOjE3MTIxNDkzMjgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjI1ZjZkN2ZlLWUyMmUtNDdmNS04MjM1LTBiYjA2ZWUwMTA2ZiIsInN1YiI6InJuMjE5OUBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoicmVhY3RBcHAiLCJjbGllbnRJRCI6IjI1ZjZkN2ZlLWUyMmUtNDdmNS04MjM1LTBiYjA2ZWUwMTA2ZiIsImNsaWVudFNlY3JldCI6IkVKRG5La3FsUmJITE1MZ3EiLCJvd25lck5hbWUiOiJSYWdoYXYiLCJvd25lckVtYWlsIjoicm4yMTk5QHNybWlzdC5lZHUuaW4iLCJyb2xsTm8iOiJSQTIxMTEwMjYwMzAxNzUifQ.dUGYvrQLSev8Dx5kuJSyiJW43si06CFC104CPPA4ZnQ`
  }
});

const fetchNumbersFromThirdPartyServer = async (numberId: string): Promise<number[]> => {
  let url = '';

  switch (numberId) {
    case 'p':
      url = 'http://20.244.56.144/test/primes';
      break;
    case 'f':
      url = 'http://20.244.56.144/test/fibo';
      break;
    case 'e':
      url = 'http://20.244.56.144/test/even';
      break;
    case 'r':
      url = 'http://20.244.56.144/test/rand';
      break;
    default:
      return [];
  }

  try {
    const response = await axios.get(url, getRequestConfig());
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching numbers:', error);
    return [];
  }
};

const isQualifiedNumberId = (numberId: string): boolean => {
  const qualifiedIds = ['p', 'f', 'e', 'r'];
  return qualifiedIds.includes(numberId);
};

const getNumbersForId = async (numberId: string): Promise<number[]> => {
  if (!isQualifiedNumberId(numberId)) {
    return [];
  }

  const fetchedNumbers = await fetchNumbersFromThirdPartyServer(numberId);
  const qualifiedNumbers = fetchedNumbers.filter((num) => {
    switch (numberId) {
      case 'p':
        return isPrime(num);
      case 'f':
        return isFibonacci(num);
      case 'e':
        return isEven(num);
      case 'r':
        return isRandom(num);
      default:
        return false;
    }
  });

  return qualifiedNumbers;
};

const storeUniqueNumbers = (newNumbers: number[]): void => {
  const uniqueNumbers = [...new Set([...numbers.getItems(), ...newNumbers])];
  numbers.getItems().forEach(num => numbers.removeFirst());
  uniqueNumbers.forEach(num => numbers.addLast(num));
};

const calculateAverage = (nums: number[]): number => {
  if (nums.length === 0) {
    return 0;
  }

  const sum = nums.reduce((acc, curr) => acc + curr, 0);
  return sum / nums.length;
};

export const getAverageForNumberId = async (numberId: string): Promise<{ windowPrevState: number[]; windowCurrState: number[]; numbers: number[]; avg: number }> => {
  const startTime = Date.now();

  const fetchedNumbers = await getNumbersForId(numberId);

  if (Date.now() - startTime > TIMEOUT_DURATION) {
    return { windowPrevState: numbers.getItems(), windowCurrState: numbers.getItems(), numbers: [], avg: calculateAverage(numbers.getItems()) };
  }

  const prevNumbers = [...numbers.getItems()];
  storeUniqueNumbers(fetchedNumbers);

  return {
    windowPrevState: prevNumbers,
    windowCurrState: numbers.getItems(),
    numbers: fetchedNumbers,
    avg: calculateAverage(numbers.getItems()),
  };
};