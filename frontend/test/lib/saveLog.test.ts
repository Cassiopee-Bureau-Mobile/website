import { beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';

import { saveLog } from '@/lib/saveLog';

vi.mock('fs');

describe('saveLog', () => {
    const mockExistsSync = vi.mocked(fs.existsSync);
    const mockMkdirSync = vi.mocked(fs.mkdirSync);
    const mockWriteFile = vi.mocked(fs.writeFile);

    const log = 'This is a test log';
    const name = 'test';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Log folder does not exist', () => {
        mockExistsSync.mockReturnValue(false);

        saveLog(log, name);

        expect(mockExistsSync).toHaveBeenCalledWith('../logs');
        expect(mockMkdirSync).toHaveBeenCalledWith('../logs');
        expect(mockExistsSync).toHaveBeenCalledWith(`../logs/${name}`);
        expect(mockMkdirSync).toHaveBeenCalledWith(`../logs/${name}`);
        expect(mockWriteFile).toHaveBeenCalledWith(
            expect.stringContaining(`../logs/${name}`),
            log,
            expect.any(Function)
        );
    });

    it('Log folder exist and name folder doesn\'t exist', () => {
        mockExistsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
        saveLog(log, name);

        expect(mockExistsSync).toHaveBeenCalledWith('../logs');
        expect(mockMkdirSync).toHaveBeenCalledOnce();
        expect(mockExistsSync).toHaveBeenCalledWith(`../logs/${name}`);
        expect(mockMkdirSync).toHaveBeenCalledWith(`../logs/${name}`);
        expect(mockWriteFile).toHaveBeenCalledWith(
            expect.stringContaining(`../logs/${name}`),
            log,
            expect.any(Function)
        );
    });

    it('Log folder and name folder exist', () => {
        mockExistsSync.mockReturnValue(true);

        saveLog(log, name);

        expect(mockExistsSync).toHaveBeenCalledWith('../logs');
        expect(mockMkdirSync).not.toHaveBeenCalled();
        expect(mockExistsSync).toHaveBeenCalledWith(`../logs/${name}`);
        expect(mockMkdirSync).not.toHaveBeenCalled();
        expect(mockWriteFile).toHaveBeenCalledWith(
            expect.stringContaining(`../logs/${name}`),
            log,
            expect.any(Function)
        );
    });
});