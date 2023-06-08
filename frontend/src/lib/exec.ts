import { spawn } from 'child_process';
import { logger } from '@/lib/logger';
import { saveLog } from '@/lib/saveLog';

/**
 * Execute a command and return the stdout
 * @param cmd Command to execute
 * @param onStdout Callback to get the stdout
 * @param customName Custom name for the log file
 * @returns stdout
 * @throws Error if the command exited with a non-zero code
 */
export async function exec(cmd: string, onStdout?: (data: string) => void, customName?: string): Promise<string> {
    let stdout = '';
    const subprocess = spawn(cmd, { shell: true });
    subprocess.stdout.on('data', (_data) => {
        const data = _data.toString();
        stdout += data;
        if (onStdout) onStdout(data);
    });

    subprocess.stderr.on('data', (data) => {
        logger.error(data.toString());
    });

    const exitCode = await new Promise<number>((resolve) => {
        subprocess.on('close', resolve);
    });

    if (customName) {
        logger.debug(`Command ${customName} exited with code ${exitCode}.`);
        const file = `Command ${cmd} exited with code ${exitCode}.\n${stdout}`;
        saveLog(file, customName);
    }

    if (exitCode !== 0) {
        throw new Error(`Command exited with code ${exitCode}`);
    }

    return stdout;
}
