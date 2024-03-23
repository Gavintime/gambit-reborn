<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Gambit Reborn</RouterLink>
      <RouterLink to="/new-game">New Game</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <!-- TODO: check if logged in and show account page otherwise -->
      <RouterLink to="/login">Login</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
nav {
  background-color: lightgrey;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 0;
}

nav>a {
  text-decoration: none;
  padding: 1em;
  display: block;
  color: black;
  text-align: center;
}

nav>a:hover {
  background-color: darkgrey
}
</style>