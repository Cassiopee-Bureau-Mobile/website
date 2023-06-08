import { existsSync, mkdirSync, writeFile } from 'fs';
import { logger } from '@/lib/logger';

/**
 * Save a log file
 * @param log Log to save
 * @param name Name of the log file
 */
export function saveLog(log: string, name: string): void {
    // Test if the logs folder exists
    if (!existsSync('../logs')) {
        mkdirSync('../logs');
    }
    // Test if name folder extists under logs
    if (!existsSync(`../logs/${name}`)) {
        mkdirSync(`../logs/${name}`);
    }
    writeFile(`../logs/${name}/[${new Date().toISOString()}]-${name}.log`, log, (err) => {
        if (err) logger.error(err);
    });
}
