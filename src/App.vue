
<template>
  <div class="container">
    <h1>Read file</h1>
    <div class="input">
      <input type="file" ref="file" @change="chartAccountsBANK" />
    </div>
    <button @click="copy">Copy Balance Tree Payload</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payloadTree: {},
    };
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(JSON.stringify(this.payloadTree, null, 4));
    },
    async chartAccountsBANK() {
      const file = this.$refs.file.files[0];
      const fileText = await this.fileToText(file);
      const { payloadTree, payloadConvertAccount } =
        this.buildChartAccountsBANKPayloads(fileText);
      this.payloadTree = payloadTree;
    },
    async fileToText(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsText(file);
      });
    },
    buildChartAccountsBANKPayloads(fileText) {
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
      const lines = fileText.trim().split("\n");
      const firstLine = 0;

      while (lines.length > 0) {
        const lineWithoutData =
          lines[firstLine] !==
          "CNPJINT,TIPOCONTA,CLASSIFCONTA,DESCRCONTA,CONTACTB";

        if (lineWithoutData) {
          lines.splice(firstLine, 1);
        } else {
          break;
        }
      }
      const headerLine = lines[firstLine].split(",");

      const CNPJPosition = headerLine.findIndex(
        (column) => column === "CNPJINT"
      );
      const CONTACTBPosition = headerLine.findIndex(
        (column) => column === "CONTACTB"
      );
      const TIPOCONTAPosition = headerLine.findIndex(
        (column) => column === "TIPOCONTA"
      );
      const DESCRCONTAPosition = headerLine.findIndex(
        (column) => column === "DESCRCONTA"
      );
      const CLASSIFCONTAPosition = headerLine.findIndex(
        (column) => column === "CLASSIFCONTA"
      );
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
    },
  },
};
</script>
<style>
.container {
  position: absolute;
  right: 50%;
  top: 25%;
  transform: translateX(50%);
}

.input {
  margin: 10px 0;
}
</style>
