<script setup type='ts'>

const loggedIn = ref(false)

</script>

<template>
  <header>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">
            Gambit Reborn
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/newGame">
            New Game
          </NuxtLink>
        </li>
        <li v-if="loggedIn">
          <NuxtLink to="/account">
            Account
          </NuxtLink>
        </li>
        <li v-else>
          <NuxtLink to="/login">
            Login
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style>
nav {
  background-color: lightgrey;
}

nav>ul {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 0;
}

nav>ul>li>a {
  text-decoration: none;
  padding: 1em;
  display: block;
  color: black;
  text-align: center;
}

nav>ul>li>a:hover {
  background-color: darkgrey
}
</style>
