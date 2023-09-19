import get from "lodash/get";

export function getLS(key) {
  let val = localStorage.getItem(key) || "";
  return ["undefined", "null", "NaN"].indexOf(val) > -1 ? "" : val;
}

export function displayErrMsg(enqueueSnackbar) {
  return (error) =>
    enqueueSnackbar(
      get(error, "response.data.message", "درخواست با خطا مواجه شد"),
      { variant: "error" }
    );
}

export function formatNumber(num) {
  return (num || 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function formatValue(type, value) {
  const _val = value || "";
  if (type === "NUMBER") {
    return formatNumber(value === 0 ? "0" : _val);
  }
  return _val;
}

export function parseToJSON(jsonString, defaultValue) {
  try {
    return JSON.parse(jsonString || JSON.stringify(defaultValue));
  } catch (error) {
    return defaultValue;
  }
}

export function getUrlParameter(name) {
  // name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(window.location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
