// @flow

import I18n from "react-native-i18n";

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
// $FlowExpectedError Needed to force this to be of type "Error"
): Error {
  this.code = code;
  this.title = title || I18n.t("error.unknown");
  this.detail = detail;

  this.message = `${this.title} (${this.code}) - ${JSON.stringify(
    this.detail
  )}`;
}
// $FlowExpectedError
APIError.prototype = Error.prototype;
