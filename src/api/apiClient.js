import axios from "axios";
import Config from "../Config";
import eventBus from "../utils/eventBus";

const apiClient = axios.create({
    baseURL: Config.BackendBaseURL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.response.use(
    (response) => {
        // Any successful response will go through here
        return response;
    },
    (error) => {
        // Any error response will go through here
        if (error.response) {
            if (error.response.status === 401) {
                // Session expired or invalid credentials
                eventBus.dispatch('sessionExpired');
            } else if (error.response.status === 500) {
                // Server error
                eventBus.dispatch('unknownError');
            }
        }
        return Promise.reject(error);
    }
)

export default apiClient;