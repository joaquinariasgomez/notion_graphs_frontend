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