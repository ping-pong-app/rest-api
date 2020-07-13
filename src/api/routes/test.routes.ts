import { Route } from "../../config";
import { developmentModeFilter } from "../middlewares";
import { emptyData, fillInitialData } from "../resources/test.resources";

export const routes: Route[] = [
    {
        path: "/v1/test/fill",
        method: "post",
        handler: [
            developmentModeFilter,
            fillInitialData
        ]
    },
    {
        path: "/v1/test/empty",
        method: "delete",
        handler: [
            developmentModeFilter,
            emptyData
        ]
    }
];
