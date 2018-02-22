// @flow
import parse from "date-fns/parse";

// Just regular function compose, is particularly useful with converters
export function compose<A, B, C>(a: (_: B) => A, b: (_: C) => B): (_: C) => A {
  return x => a(b(x));
}

// A converter is just a function from mixed (which will be validated at
// runtime) to a given static type
export type Converter<T> = (d: mixed) => T;

export function ConverterError(message: string, path: string = "") {
  this.originalMessage = message;
  this.path = path;
  this.message = this.path + ": " + this.originalMessage;
}
ConverterError.prototype = Object.create(Error.prototype);

////////////////////
// Simple Converters
////////////////////

export function string(d: mixed): string {
  if (typeof d !== "string") throw new ConverterError("Not a string");
  return d;
}

export function boolean(d: mixed): boolean {
  if (typeof d !== "boolean") throw new ConverterError("Not a boolean");
  return d;
}

// A string of a specified length
export function stringLen(l: number) {
  return function(d: mixed): string {
    const s = string(d);
    if (s.length !== l)
      throw new ConverterError("String isn't of length: " + l);
    return s;
  };
}

// A string or something that can be made into a string easily
export function stringish(d: mixed): string {
  if (typeof d === "string") {
    return d;
  } else if (typeof d === "number") {
    return String(d);
  } else if (typeof d === "boolean") {
    return d ? "true" : "false";
  } else if (d == null) {
    return "";
  }
  throw new ConverterError("Not stringish");
}

// An id as used in the api (api used numbers, we'll use strings internally)
export function id(d: mixed): string {
  if (typeof d !== "number") throw new ConverterError("Ids in api are numbers");
  return String(d);
}

// A number
export function float(d: mixed): number {
  if (typeof d !== "number") throw new ConverterError("Not a number");
  return d;
}

// A integer number
export function integer(d: mixed): number {
  const n: number = float(d);
  if (n !== Math.floor(n)) throw new ConverterError("Not an integer");
  return n;
}

// A timestamp in ISO format (but we accept the nearly-ISO-format the API
// currently gives with space as a time seperator and a space before the
// offset), we'll use UTC version internally
const nearlyISOFormat = /^(\d\d\d\d-\d\d-\d\d) (\d\d:\d\d:\d\d) ([+-]\d\d\d\d)$/;
export function timestamp(d: mixed): string {
  let s = string(d);
  const nearlyMatch = nearlyISOFormat.exec(s);
  if (nearlyMatch) {
    s = `${nearlyMatch[1]}T${nearlyMatch[2]}${nearlyMatch[3]}`;
  }
  return parse(s)
    .toISOString()
    .replace(/[.]\d+Z$/, "Z");
}

function pad(s, n = 2) {
  s = "" + s;
  while (s.length < n) {
    s = "0" + s;
  }
  return s;
}

// Time in HH:MM or HH:MM:SS format (we disgard the seconds)
export function time(d: mixed): string {
  const s = string(d);
  const matched = /^(\d\d):(\d\d)(:\d\d)?$/.exec(s);
  if (!matched) throw new ConverterError("Time must be HH:MM");
  let [, h, m] = matched;
  h = parseInt(h);
  m = parseInt(m);
  if (h < 0 || h > 23)
    throw new ConverterError("Hours must be between 0 and 23");
  if (m < 0 || m > 60)
    throw new ConverterError("Minutes must be between 0 and 60");
  return `${pad(h)}:${pad(m)}`;
}

// Useful for composing with other things
export function mixed(d: mixed): mixed {
  return d;
}

//////////////////////////
// Higher order Converters
//////////////////////////

export function maybe<T>(converter: Converter<T>): Converter<?T> {
  return function(d) {
    if (d == null) return null;
    return converter(d);
  };
}

// Value if present an non-falsy otherwise default value
export function defaultValue<T>(
  converter: Converter<T>,
  defaultValue: T
): Converter<T> {
  return function(d) {
    if (!d) return defaultValue;
    return converter(d);
  };
}

// For when you just want to supply a fixed value (for composing with other things)
export function value<T>(v: T): Converter<T> {
  return () => v;
}

// An array of values
export function array<T>(converter: Converter<T>): Converter<T[]> {
  return function(d) {
    if (!Array.isArray(d)) throw new ConverterError("Not an array");
    return d.map((x, i) => {
      try {
        return converter(x);
      } catch (e) {
        if (e instanceof ConverterError) {
          throw new ConverterError(
            e.originalMessage,
            "[" + String(i) + "]" + e.path
          );
        } else {
          throw e;
        }
      }
    });
  };
}

// Fixed length array
export function arrayLen<T>(
  length: number,
  converter: Converter<T>
): Converter<T[]> {
  const arrayConverter = array(converter);
  return d => {
    const a = arrayConverter(d);
    if (a.length !== length)
      throw new ConverterError(
        `Array is of length ${a.length} (expected ${length})`
      );
    return a;
  };
}

type ExtractValue = <V>(s: Converter<V>) => V;

// An object with heterogeneous values
export function object<V, Converters: { [key: string]: Converter<V> }>(
  converters: Converters
): Converter<$ObjMap<Converters, ExtractValue>> {
  return (d: mixed) => {
    const output = {};
    for (let key in converters) {
      output[key] = converters[key](d);
    }
    return output;
  };
}

// A homogeneous valued object
export function objectValues<V>(
  converter: Converter<V>
): Converter<{ [key: string]: V }> {
  return (d: mixed) => {
    if (d == null || typeof d !== "object")
      throw new ConverterError("Not an object");
    const output = {};
    for (let key in d) {
      try {
        output[key] = converter(d[key]);
      } catch (e) {
        if (e instanceof ConverterError) {
          throw new ConverterError(
            e.originalMessage,
            e.path ? key + "." + e.path : key
          );
        } else {
          throw e;
        }
      }
    }
    return output;
  };
}

// Extract a field from an object (checks that the input is an object and that
// it has the field)
export function field<T>(
  fieldName: string,
  converter: Converter<T>
): Converter<T> {
  return d => {
    if (d == null || typeof d !== "object") {
      throw new ConverterError(
        "Not an object (trying to access field: " + fieldName + ")"
      );
    }
    if (!(fieldName in d)) {
      throw new ConverterError("Field not found", fieldName);
    }
    try {
      return converter(d[fieldName]);
    } catch (e) {
      if (e instanceof ConverterError) {
        throw new ConverterError(
          e.originalMessage,
          e.path ? fieldName + "." + e.path : fieldName
        );
      } else {
        throw e;
      }
    }
  };
}

// Tries the converter, if it succeeds return if it fails then return the error value
export function tryConverter<V>(
  converter: Converter<V>,
  errorValue: V
): Converter<?V> {
  return d => {
    try {
      return converter(d);
    } catch (e) {
      if (e instanceof ConverterError) {
        return errorValue;
      } else {
        throw e;
      }
    }
  };
}
