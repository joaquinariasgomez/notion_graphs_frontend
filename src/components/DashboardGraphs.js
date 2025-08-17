import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { getGraphConfigurations } from "../api/RequestUtils";

export default function DashboardGraphs({ }) {

    // Context
    const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

    const [graphConfigurationsLoading, setGraphConfigurationsLoading] = useState(false);
    const [graphConfigurations, setGraphConfigurations] = useState([]);

    useEffect(() => {
        fetchGraphConfigurations();
    }, []);

    const fetchGraphConfigurations = async () => {
        try {
            setGraphConfigurationsLoading(true);
            const apiResponse = await getGraphConfigurations(userJWTCookie);
            if (apiResponse) {
                setGraphConfigurations(apiResponse);
            }
        } catch (error) {

        } finally {
            setGraphConfigurationsLoading(false);
        }
    }

    return (
        <div>
            Hey nigger
        </div>
    );
}