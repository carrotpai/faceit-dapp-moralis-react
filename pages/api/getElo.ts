// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const Faceit = require('faceit-js');
const api = new Faceit("bbc7cdfd-c18b-4e9e-bd98-3ca5e4c2bac6");

type Data = {
  name: string
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const b = req.body;
  console.log(b);
  res.status(200).json(b);
}
