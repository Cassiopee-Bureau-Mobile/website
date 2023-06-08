import { beforeEach, describe, expect, it, vi } from 'vitest';
import { spawn } from 'child_process';
import { logger } from '@/lib/logger';
import { saveLog } from '@/lib/saveLog';

import { exec } from '@/lib/exec';

// Mocking spawn function
vi.mock('child_process');
vi.mock('@/lib/logger');
vi.mock('@/lib/saveLog');

describe('exec', () => {
    const mockSpawn = vi.mocked(spawn);
    const mockLogger = vi.mocked(logger);
    const mockSaveLog = vi.mocked(saveLog);
    const onStdout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Command executes successfully with stdout', async () => {

        const cmd = 'echo "Test command"';
        const customName = 'Test command';
        const exitCode = 0;
        const stdout = 'Test output';

        // Mocking subprocess
        const subprocess = {
            stdout: {
                on: vi.fn((event, callback) => {
                    if (event === 'data') callback('Test output');
                }),
            },
            stderr: {
                on: vi.fn(),
            },
            on: vi.fn((event, callback) => {
                if (event === 'close') callback(exitCode);
            }),
        };

        mockSpawn.mockReturnValue(subprocess as any);

        const result = await exec(cmd, onStdout, customName);

        expect(spawn).toHaveBeenCalledWith(cmd, { shell: true });
        expect(subprocess.stdout.on).toHaveBeenCalledWith('data', expect.any(Function));
        expect(subprocess.stderr.on).toHaveBeenCalledWith('data', expect.any(Function));
        expect(subprocess.on).toHaveBeenCalledWith('close', expect.any(Function));
        expect(onStdout).toHaveBeenCalledWith(stdout);
        expect(mockLogger.debug).toHaveBeenCalledWith(`Command ${customName} exited with code ${exitCode}.`);
        expect(mockSaveLog).toHaveBeenCalledWith(
            `Command ${cmd} exited with code ${exitCode}.\n${stdout}`,
            customName
        );
        expect(result).toBe(stdout);
    });

    it('exec - Command fails with non-zero exit code', async () => {
        const cmd = 'invalid-command';
        const exitCode = 1;

        // Mocking subprocess
        const subprocess = {
            stdout: {
                on: vi.fn(),
            },
            stderr: {
                on: vi.fn((event, callback) => {
                    if (event === 'data') callback('Test error');
                }),
            },
            on: vi.fn((event, callback) => {
                if (event === 'close') callback(exitCode);
            }),
        };

        mockSpawn.mockReturnValue(subprocess as any);

        await expect(exec(cmd)).rejects.toThrow(`Command exited with code ${exitCode}`);

        expect(mockLogger.error).toHaveBeenCalledWith('Test error');
    });
});
