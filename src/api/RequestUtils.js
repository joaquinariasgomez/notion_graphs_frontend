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

export async function connectToNotion(jwtToken, notionCode) {
  const url = Config.BackendWalletConnectionURL + "/" + notionCode;
  const response = postWithJWTToken(url, null, jwtToken);
  return (await response).data;
}

export async function loginWithGoogle(googleTokenBody) {
  const url = Config.BackendAuthURL + "/login/with-google";
  const response = apiClient.post(url, googleTokenBody, null);
  return (await response).data;
}

export async function logoutFromSystem(jwtToken) {
  const url = Config.BackendAuthURL + "/logout";
  const response = postWithJWTToken(url, null, jwtToken);
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

export async function refreshIntegrationConnection(jwtToken) {
  const url = Config.BackendWalletConnectionURL + "/refresh";
  const response = postWithJWTToken(url, null, jwtToken);
  return (await response).data;
}

export async function unlinkIntegrationConnection(jwtToken) {
  const url = Config.BackendWalletConnectionURL;
  const response = deleteWithJWTToken(url, jwtToken);
  return (await response).data;
}

export async function getBillingGraphCount(jwtToken) {
  const url = Config.BackendBillingConnectionURL + "/graphCount";
  const response = getWithJWTToken(url, jwtToken);
  return (await response).data;
}

export async function getBillingPlan(jwtToken) {
  const url = Config.BackendBillingConnectionURL + "/plan";
  const response = getWithJWTToken(url, jwtToken);
  return (await response).data;
}

export async function createStripeCheckoutSession(jwtToken, priceId) {
  const url = Config.BackendBillingConnectionURL + "/stripe/create-checkout-session?priceId=" + priceId;
  const response = postWithJWTToken(url, null, jwtToken);
  return (await response).data;
}

export async function createStripeCustomerPortalSession(jwtToken) {
  const url = Config.BackendBillingConnectionURL + "/stripe/create-customer-portal-session";
  const response = postWithJWTToken(url, null, jwtToken);
  return (await response).data;
}

export async function deleteAccount(jwtToken) {
  const url = Config.BackendAccountConnectionURL;
  const response = deleteWithJWTToken(url, jwtToken);
  return (await response).data;
}

export async function registerValue(jwtToken, request) {
  const url = Config.BackendWidgetsConnectionURL + "/register-value";
  const response = postWithJWTToken(url, request, jwtToken);
  return (await response).data;
}