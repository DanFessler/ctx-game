export type FieldMeta = {
  type?: string;
  min?: number;
  max?: number;
  tooltip?: string;
};

const fieldMetadata = new Map<Function, Map<string, FieldMeta>>();

export function inspect(meta: FieldMeta = {}): PropertyDecorator {
  return (target, propertyKey) => {
    const ctor = target.constructor;

    if (!fieldMetadata.has(ctor)) {
      fieldMetadata.set(ctor, new Map());
    }

    const fields = fieldMetadata.get(ctor)!;

    // Try to infer type if none provided
    if (!meta.type) {
      const reflected = Reflect.getMetadata("design:type", target, propertyKey);

      if (reflected) {
        meta.type = reflected.name.toLowerCase(); // e.g. "number", "string"
      }
    }

    fields.set(propertyKey as string, meta);
  };
}

export function getSerializableFields<T>(
  instance: T
): Record<keyof T, FieldMeta> {
  const ctor = (instance as any).constructor;
  const entries = fieldMetadata.get(ctor)?.entries() ?? [];
  return Object.fromEntries(entries) as Record<keyof T, FieldMeta>;
}

export type SerializedFields<T> = {
  [K in keyof T]: {
    value: T[K];
    meta: FieldMeta;
  };
};
