import Config from "./Config";

export function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export async function loginToNotionWithCode(notionCode) {
  const auth_url = Config.BackendBaseURL + Config.BackendLoginURL + "/" + notionCode;
  const result = await fetch(auth_url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json()
    });
  return result;
}

export async function logoutFromNotion(jwtToken) {
  const auth_url = Config.BackendBaseURL + Config.BackendLogoutURL;
  await fetch(auth_url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    }
  });
}

export async function getExpensesCategories(jwtToken) {
  const graphs_url = Config.BackendBaseURL + Config.BackendGraphsURL;
  return await fetch(graphs_url + "/expenses-categories", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json()
    });
}

export async function getIncomesBankaccounts(jwtToken) {
  const graphs_url = Config.BackendBaseURL + Config.BackendGraphsURL;
  return await fetch(graphs_url + "/incomes-bankaccounts", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json()
    });
}

export async function getIncomesSources(jwtToken) {
  const graphs_url = Config.BackendBaseURL + Config.BackendGraphsURL;
  return await fetch(graphs_url + "/incomes-sources", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json()
    });
}