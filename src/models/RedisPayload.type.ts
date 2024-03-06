export type RedisPayloadOne = {
  key: string;
  value?: string | number;
};

export type RedisPayloadMany = {
  items: RedisPayloadOne[];
};
