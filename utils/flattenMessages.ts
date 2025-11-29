type NestedValue = string | number | boolean | NestedObject | NestedValue[];
type NestedObject = { [key: string]: NestedValue };

export function unflatten(flat: Record<string, NestedValue>): NestedObject {
  const result: NestedObject = {};

  for (const [key, value] of Object.entries(flat)) {
    const keys = key.split('.');
    let current = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key]) {
          // Check if the next key is a number to determine if it should be an array
          const nextKey = keys[i + 1];
          current[key] = !isNaN(parseInt(nextKey)) ? [] : {};
        }
        current = current[key] as NestedObject;
      }
    }
  }

  return result;
}
