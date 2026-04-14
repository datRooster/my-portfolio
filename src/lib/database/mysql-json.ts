import { Prisma } from '@prisma/client';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => isString(item));
}

export function writeStringArray(value: unknown): Prisma.InputJsonValue {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isString);
}

export function readJsonObject<T extends Record<string, unknown>>(
  value: unknown
): T | undefined {
  if (!isPlainObject(value)) {
    return undefined;
  }

  return value as T;
}

export function writeJsonValue(
  value: unknown
): Prisma.InputJsonValue | typeof Prisma.DbNull | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.DbNull;
  }

  if (Array.isArray(value)) {
    return value as Prisma.InputJsonArray;
  }

  if (isPlainObject(value)) {
    return value as Prisma.InputJsonObject;
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  return undefined;
}
