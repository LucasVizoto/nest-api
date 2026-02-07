export abstract class CacheRepository {
  abstract set(key: string, value: string): Promise<void>;
  abstract get(key: string): Promise<string | null>;
  abstract invalidate(key: string): Promise<void>; // invalidação é deletá-lo
}
