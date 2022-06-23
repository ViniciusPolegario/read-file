export default function useReadFile() {

    async function fileToText(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsText(file);
        });
    }
    function verifyHeaderLine(line) {
        const columns = ["CONTACTB", "TIPOCONTA", "CLASSIFCONTA", "DESCRCONTA"]
        const cnpjLabel = ["CNPJORIG", "CNPJINT"]
        let columnsIncludes = 0

        for (let column = 0; column < line.length; column++) {
            if (columns.includes(line[column]) || cnpjLabel.includes(line[column])) {
                columnsIncludes += 1
            }
        }

        return columnsIncludes === columns.length + 1
    }

    function buildChartAccountsBANKPayloads(fileText) {
        const payloadTree = {
            nationalRegister: "",
            clientAccounts: [],
        };

        const payloadConvertAccount = {
            nationalRegister: "",
            identifier: "",
            chart: [],
        };

        const readLine = 1;
        const lines = fileText.trim().replaceAll("\r", "").split("\n");
        const firstLine = 0;

        let headerLine = lines[firstLine].split(",");

        while (lines.length > 0) {
            const isHeaderLine = verifyHeaderLine(headerLine)
            console.log({isHeaderLine})
            console.log({headerLine})
            if (!isHeaderLine) {
                lines.splice(firstLine, 1);

                headerLine = lines[firstLine].split(",");
            } else {
                break;
            }
        }
        console.log({ lines })

        const CNPJPosition = headerLine.findIndex(
            (column) => column.toUpperCase() === "CNPJINT" || column.toUpperCase() === "CNPJORIG"
        );
        const CONTACTBPosition = headerLine.findIndex(
            (column) => column.toUpperCase() === "CONTACTB"
        );
        const TIPOCONTAPosition = headerLine.findIndex(
            (column) => column.toUpperCase() === "TIPOCONTA"
        );
        const DESCRCONTAPosition = headerLine.findIndex(
            (column) => column.toUpperCase() === "DESCRCONTA"
        );
        const CLASSIFCONTAPosition = headerLine.findIndex(
            (column) => column.toUpperCase() === "CLASSIFCONTA"
        );
        console.log(lines[readLine].split(",")[CNPJPosition])
        const nationalRegister = lines[readLine].split(",")[CNPJPosition].padStart(14, "0");
        const masterGroupName = "masterGroupName";

        payloadTree.nationalRegister = nationalRegister;
        payloadConvertAccount.nationalRegister = nationalRegister;
        payloadConvertAccount.identifier = `${masterGroupName}-${nationalRegister}`;

        for (let line = readLine; line < lines.length; line += 1) {
            const currentLine = lines[line];
            const currentColumn = currentLine.split(",");

            const clientAccount = {
                CONTACTB: currentColumn[CONTACTBPosition],
                CLASSIFCONTA: currentColumn[CLASSIFCONTAPosition],
                DESCRCONTA: currentColumn[DESCRCONTAPosition],
                TIPOCONTA: currentColumn[TIPOCONTAPosition],
            };

            const chart = {
                clientAccount: currentColumn[CLASSIFCONTAPosition],
                clientAccountDescription: currentColumn[DESCRCONTAPosition],
                clientAccountLevel: currentColumn[TIPOCONTAPosition],
            };

            payloadConvertAccount.chart.push(chart);
            payloadTree.clientAccounts.push(clientAccount);
        }

        return {
            payloadTree,
            payloadConvertAccount,
        };
    }

    async function chartAccountsBANK(file, data) {

        const fileText = await fileToText(file);
        const { payloadTree, payloadConvertAccount } =
            buildChartAccountsBANKPayloads(fileText);
        data.value = payloadTree
        return payloadTree

    }

    return {
        chartAccountsBANK
    }
}

