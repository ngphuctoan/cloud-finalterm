import { match } from "ts-pattern";

type MessageError = {
  message: string;
};

type ValidationError = {
  fieldErrors: Record<string, string[]>;
};

type UnknownError = Record<string, unknown>;

export type FetchErrorType = "message" | "validation" | "unknown";

export type FetchError<T extends FetchErrorType> = T extends "message"
  ? MessageError
  : T extends "validation"
    ? ValidationError
    : T extends "unknown"
      ? UnknownError
      : never;

export default function parseError<T extends FetchErrorType>(
  data: FetchError<"unknown">,
) {
  return match(data)
    .when(
      (data) => Object.hasOwn(data, "message"),
      () => ({ message: data.message }),
    )
    .when(
      (data) => Object.hasOwn(data, "nested"),
      () => ({ fieldErrors: data.nested }),
    )
    .otherwise((data) => data) as FetchError<T>;
}
