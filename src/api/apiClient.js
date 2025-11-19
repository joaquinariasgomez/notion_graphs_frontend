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
            if (error.response.status === 400) {
                // Check if this is a billing limit error
                const responseData = error.response.data;
                const billingLimitErrors = ['MAXIMUM_GRAPH_COUNT', 'MAXIMUM_GRAPH_LIST', 'MAXIMUM_GRAPH_REFRESH_COUNT'];

                if (typeof responseData === 'string' && billingLimitErrors.includes(responseData)) {
                    // This is a billing limit error
                    eventBus.dispatch('billingLimitError', responseData);
                } else {
                    // Generic client error
                    eventBus.dispatch('clientError');
                }
            } else if (error.response.status === 401) {
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