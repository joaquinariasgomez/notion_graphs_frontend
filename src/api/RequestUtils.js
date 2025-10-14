import Config from "../Config";
import apiClient from "./apiClient";

export function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function postWithJWTToken(url, data, jwtToken) {
  const config = {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    },
  };
  return apiClient.post(url, data, config);
}

export function putWithJWTToken(url, data, jwtToken) {
  const config = {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    },
  };
  return apiClient.put(url, data, config);
}

export function deleteWithJWTToken(url, jwtToken) {
  const config = {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    },
  };
  return apiClient.delete(url, config);
}

export function getWithJWTToken(url, jwtToken) {
  const config = {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    },
  };
  return apiClient.get(url, config);
}

export async function loginToNotionWithCode(notionCode) {
  const auth_url = Config.BackendLoginURL + "/" + notionCode;
  const response = apiClient.post(auth_url);
  return (await response).data;
}

export async function logoutFromNotion(jwtToken) {
  const auth_url = Config.BackendLogoutURL;
  const response = postWithJWTToken(auth_url, null, jwtToken);
  return (await response).data;
}

export async function getExpensesCategories(jwtToken) {
  const url = Config.BackendGraphsURL + "/expenses-categories";
  const response = getWithJWTToken(url, jwtToken);
  return (await response).data;
}

export async function getIncomesBankaccounts(jwtToken) {
  const url = Config.BackendGraphsURL + "/incomes-bankaccounts";
  const response = getWithJWTToken(url, jwtToken);
  return (await response).data;
}

export async function getIncomesSources(jwtToken) {
  const url = Config.BackendGraphsURL + "/incomes-sources";
  const response = getWithJWTToken(url, jwtToken);
  return (await response).data;
}

export async function getGraphs(jwtToken) {
  const url = Config.BackendGraphsURL;
  const response = getWithJWTToken(url, jwtToken);
  return (await response).data;
}

export async function getMoreGraphs(jwtToken, nextCursor) {
  const url = Config.BackendGraphsURL + "?cursor=" + nextCursor;
  const response = getWithJWTToken(url, jwtToken);
  return (await response).data;
}

export async function createGraph(jwtToken, graphConfiguration) {
  const url = Config.BackendGraphsURL;
  const response = postWithJWTToken(url, graphConfiguration, jwtToken);
  return (await response).data;
}

export async function deleteGraph(jwtToken, graphConfigurationId) {
  const url = Config.BackendGraphsURL + "/" + graphConfigurationId;
  await deleteWithJWTToken(url, jwtToken);
}

export async function updateGraphConfiguration(jwtToken, graphConfigurationId, graphConfiguration) {
  const url = Config.BackendGraphsURL + "/configuration/" + graphConfigurationId;
  const response = putWithJWTToken(url, graphConfiguration, jwtToken);
  return (await response).data;
}

export async function refreshGraph(jwtToken, graphConfigurationId) {
  const url = Config.BackendGraphsURL + "/refresh/" + graphConfigurationId;
  const response = putWithJWTToken(url, null, jwtToken);
  return (await response).data;
}

export async function reorderGraph(jwtToken, reorderRequest) {
  const url = Config.BackendGraphsURL + "/reorder";
  const response = putWithJWTToken(url, reorderRequest, jwtToken);
  return (await response).data;
}

export async function checkIntegrationConnection(jwtToken) {
  const url = Config.BackendWalletConnectionURL;
  const response = getWithJWTToken(url, jwtToken);
  return (await response).data;
}

export async function createWalletTemplate(jwtToken) {
  const url = Config.BackendWalletConnectionURL;
  const response = postWithJWTToken(url, null, jwtToken);
  return (await response).data;
}