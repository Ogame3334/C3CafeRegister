import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { CSVDataSchema, PostDataSchema } from '@/class/CSVDataSchema';


// CSVファイルを読み込む関数
const readCsv = (filePath: string) => {
    return new Promise<CSVDataSchema[]>((resolve, reject) => {
        const results: CSVDataSchema[] = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// CSVファイルを書き込む関数
const writeCsv = (filePath: string, data: CSVDataSchema[]) => {
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
    });

    return csvWriter.writeRecords(data);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const csvFilePath = path.join(process.cwd(), 'data', '会計.csv'); // ローカルにあるCSVファイルのパス

    try {
        if (req.method === 'GET') {
            // CSVを読み込む
            const data = await readCsv(csvFilePath);
            res.status(200).json({ message: 'CSV読み込み成功', data } as { message: string, data: CSVDataSchema[] });
        } else if (req.method === 'POST') {
            const data = await readCsv(csvFilePath) as CSVDataSchema[];

            const postDatas = req.body.data as PostDataSchema[];
            let accountId = 0;
            if(data.length > 0) accountId = Number(data[data.length - 1].accountId) + 1;
            const csvDatas = postDatas.map(postData => ({accountId: String(accountId), ...postData} as CSVDataSchema));

            csvDatas.forEach(csvData => {
                data.push(csvData);
            })

            // CSVに書き込む
            await writeCsv(csvFilePath, data);
            res.status(200).json({ message: 'CSV書き込み成功' });
        } else {
            res.status(405).json({ message: 'メソッドが許可されていません' });
        }
    } catch (error: unknown) {
        res.status(500).json({ message: `エラーが発生しました: ${error}` });
    }
}
