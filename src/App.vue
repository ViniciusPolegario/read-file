<template>
  <div class="container">
    <h1>Read file</h1>
    <div class="input">
      <input
        type="file"
        ref="fileRef"
        @change="chartAccountsBANK(fileRef.files[0], payloadTree)"
      />
    </div>
    <button @click="copy(payloadTree.value)">Copy Balance Tree Payload</button>
  </div>
</template>

<script>
import useCopy from "./composables/copy";
import useReadFile from "./composables/readFile";
import { ref } from "vue";

export default {
  setup() {
    const payloadTree = ref({});
    const fileRef = ref(null);

    const { copy } = useCopy();
    const { chartAccountsBANK } = useReadFile();

    return {
      copy,
      chartAccountsBANK,
      fileRef,
      payloadTree,
    };
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
