import { blankoElement } from '../../../../models/Types';
import con from '../connector';

export default { getElementsByBoss, getAllElements, setClass, setRole, copyFromTo };

async function getElementsByBoss(raid: number, enc: number): Promise<blankoElement[]> {
    return await con('blankos', 'get', {raid, enc}, true);
}

async function getAllElements(raid: number): Promise<blankoElement[]> {
    return await con('blankos', 'get', {raid}, true);
}

async function setClass(raid: any, enc: any, position: any, value: any): Promise<any> {
    return await setElement(raid, enc, position, value, 'class');
}

async function setRole(raid: any, enc: any, position: any, value: any): Promise<any> {
    return await setElement(raid, enc, position, value, 'role');
}

function setElement(raid: any, enc: any, position: any, value: any, type: any): Promise<any> {
    return con('blankos', 'post', {raid, enc, position, value, type}, true);
}

function copyFromTo(raid: number, from: number, to: number): Promise<blankoElement[]> {
    return con('blankos/copy', 'post', {raid, from, to}, true);
}