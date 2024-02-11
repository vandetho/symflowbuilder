import { NextApiRequest, NextApiResponse } from 'next';
import * as jsYaml from 'js-yaml';
import * as fs from 'fs';

const yamlFolderPath = '../../../workflows';

export function POST(req: NextApiRequest, res: NextApiResponse) {
    const yaml = jsYaml.dump(req.body, {
        indent: 4,
        lineWidth: 140,
        forceQuotes: true,
    });
    fs.writeFileSync(`${yamlFolderPath}/${req.body.workflow}.yaml`, yaml);
    const readStream = fs.createReadStream(`${yamlFolderPath}/${req.body.workflow}.yaml`);
    return readStream.pipe(res);
}
