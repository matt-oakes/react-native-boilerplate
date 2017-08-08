// @flow

import I18n from "react-native-i18n";

import * as c from "~/src/lib/converter";
import type { Converter } from "~/src/lib/converter";

function convertResponseError(error): APIError {
  return new APIError(
    error.code || -1,
    error.title || "Unknown error",
    error.detail || {}
  );
}

export const errorConverter: Converter<APIError> = c.compose(
  convertResponseError,
  c.object({
    code: c.field("error_code", c.maybe(c.integer)),
    title: c.field("error_title", c.maybe(c.string)),
    detail: c.field("error_detail", c.objectValues(c.string))
  })
);

export type APIErrorDetailType = {
  [field: string]: string
};

export type APIErrorResponseType = {|
  error_code: ?number,
  error_title: ?string,
  error_detail: APIErrorDetailType
|};

export function APIError(
  code: number = -1,
  title: ?string = null,
  detail: APIErrorDetailType = {}
) {
  this.code = code;
  this.title = title || I18n.t("error.unknown");
  this.detail = detail;

  this.message = `${this.title} (${this.code}) - ${JSON.stringify(
    this.detail
  )}`;
}
// $FlowExpectedError
APIError.prototype = Error.prototype;
