import { MockType } from "./mock.type";
import { Repository } from "typeorm";

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    findOne: jest.fn(_ => _),
    findOneBy: jest.fn(_ => _),
    insert: jest.fn(_ => _),
    find: jest.fn(_ => _),
    save: jest.fn(entity => entity),
    update: jest.fn(_ => _),
    delete: jest.fn(_ => _),
}));