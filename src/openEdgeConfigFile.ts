import * as jsonminify from 'jsonminify';
import { readFile } from 'fs';
import * as util from 'util';

const readFileAsync = util.promisify(readFile);

export const OPENEDGE_CONFIG_FILENAME = '.openedge-zext.json';

export interface TestConfig {
    files?: string[];
    beforeAll?: Command;
    afterAll?: Command;
    beforeEach?: Command;
    afterEach?: Command;
}

export interface Command {
    cmd: string;
    args?: string[];
    env?: string[];
    cwd?: string;
}
export interface PostActionTask {
    actionType: 'URL' | '';
    command?: string;
}
export interface DeploymentTask {
    taskType: 'current.all-compile' | 'current.r-code' | 'current.source' | 'current.listing' | 'current.xref' | 'current.xref-xml' | 'current.string-xml' | 'current.debug-list' | 'current.preprocess';
    path: string;
    postAction?: PostActionTask[];
}
export interface OpenEdgeFormatOptions {
    trim?: 'none' | 'right';
}
export interface OpenEdgeConfig {
    proPath?: string[];
    proPathMode?: 'append' | 'overwrite' | 'prepend';
    parameterFiles?: string[];
    configFile?: string;
    workingDirectory?: string;
    test?: TestConfig;
    dlcPath?: string;
    dbDictionary?: string[];
    deployment?: DeploymentTask[];
    format?: OpenEdgeFormatOptions;
}

export function loadConfigFile(filename: string): Thenable<OpenEdgeConfig> {
    if (!filename)
        return Promise.resolve({});
    return readFileAsync(filename, { encoding: 'utf8' }).then(text => {
        // We don't catch the parsing error, to send the error in the UI (via promise rejection)
        return JSON.parse(jsonminify(text));
    });
}
