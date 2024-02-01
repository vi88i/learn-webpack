import { join } from "lodash-es";

const downloadCsv = () => {
    const csv = [1, 2, 3];

    return join(csv, ",");
};

export default {
    downloadCsv
};
