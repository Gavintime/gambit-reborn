<script setup lang="ts">

const gameCode = await useFetch('/api/newGame')

</script>

<template>
  <div>
    <ChessBoard />
    <p>Invite Code: {{ gameCode.data.value?.code }}</p>
  </div>
</template>
