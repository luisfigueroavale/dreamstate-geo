function typeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function typesOf(schema) {
  if (Array.isArray(schema.type)) return schema.type;
  if (schema.type) return [schema.type];
  return null;
}

export function validate(value, schema, path = "$") {
  const errors = [];
  const fail = (message) => errors.push(`${path}: ${message}`);
  if (schema.const !== undefined && value !== schema.const) {
    fail(`expected ${JSON.stringify(schema.const)}`);
    return errors;
  }
  if (schema.enum && !schema.enum.includes(value)) {
    fail(`expected one of ${schema.enum.join(", ")}`);
    return errors;
  }
  const types = typesOf(schema);
  if (types && !types.includes(typeOf(value))) {
    fail(`expected ${types.join(" or ")}`);
    return errors;
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) fail(`shorter than ${schema.minLength}`);
    if (schema.maxLength !== undefined && value.length > schema.maxLength) fail(`longer than ${schema.maxLength}`);
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) fail(`below ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) fail(`above ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) fail(`fewer than ${schema.minItems} items`);
    if (schema.items) {
      value.forEach((item, index) => {
        errors.push(...validate(item, schema.items, `${path}[${index}]`));
      });
    }
  }
  if (value && typeOf(value) === "object") {
    const props = schema.properties || {};
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in value)) fail(`missing ${key}`);
      }
    }
    for (const key of Object.keys(value)) {
      if (props[key]) errors.push(...validate(value[key], props[key], `${path}.${key}`));
      else if (schema.additionalProperties === false) fail(`unexpected ${key}`);
    }
  }
  return errors;
}
