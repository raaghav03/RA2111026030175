import axios from 'axios';
import { isPrime, isFibonacci, isEven, isRandom } from '../utils/numberUtils';

const WINDOW_SIZE = 10;
const TIMEOUT_DURATION = 500;

let numbers: number[] = [];

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
    const response = await axios.get(url, { timeout: TIMEOUT_DURATION });
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
  const uniqueNumbers = [...new Set([...numbers, ...newNumbers])];
  numbers = uniqueNumbers.slice(0, WINDOW_SIZE);
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
    return { windowPrevState: numbers, windowCurrState: numbers, numbers: [], avg: calculateAverage(numbers) };
  }

  const prevNumbers = [...numbers];
  storeUniqueNumbers(fetchedNumbers);

  return {
    windowPrevState: prevNumbers,
    windowCurrState: numbers,
    numbers: fetchedNumbers,
    avg: calculateAverage(numbers),
  };
};