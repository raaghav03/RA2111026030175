import express from 'express';
import { getAverageForNumberId } from './numberService';

const app = express();
const PORT = 9876;

app.get('/numbers/:numberId', async (req, res) => {
  const { numberId } = req.params;
  const result = await getAverageForNumberId(numberId);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});