import fs from 'node:fs';
import { parse } from 'csv-parse';
import { toNamespacedPath } from 'node:path';

const filePath = new URL('../../fs_read.csv', import.meta.url);

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({
    // CSV options if any
    }));
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  //console.info(records);

  let i = 1
  for (i; i < records.length; i++) {
    const taskObjet = JSON.stringify({
      title: records[i][0],
      description: records[i][1]
    })

    const response = await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: taskObjet
    })

    console.log(response)
  }

})();