import { NextRequest, NextResponse } from 'next/server';
import jsYaml from 'js-yaml';
import * as fs from 'fs';
import { resolve } from 'path';
import { StringHelper } from '@/helpers/string.helper';
import { TokenHelper } from '@/helpers/token.helper';

const yamlFolderPath = resolve(__dirname, '../../../../../../yaml');

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    const yaml = jsYaml.dump(body, {
        indent: 4,
        lineWidth: 140,
        forceQuotes: true,
    });
    const workflowName = Object.keys(body.framework.workflow)[0];
    // if (!fs.existsSync(yamlFolderPath)) {
    //     fs.mkdirSync(yamlFolderPath);
    // }
    // const filename = `${StringHelper.replace(workflowName)}-${TokenHelper.generateToken()}.yaml`;
    // const filePath = `${yamlFolderPath}/${filename}`;
    // fs.writeFileSync(filePath, yaml);
    // const file = fs.readFileSync(filePath, 'utf8');
    return new Response(yaml, {
        headers: {
            'content-type': 'application/x-yaml',
            'content-disposition': `attachment; filename="${workflowName}.yaml"`,
        },
    });
}
