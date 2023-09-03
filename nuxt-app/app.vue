<script setup>
useSeoMeta({
  title: 'Gambit Reborn',
  description: 'Play Chess with friends online!',

  ogTitle: 'Gambit Reborn',
  ogDescription: 'Play Chess with friends online!',
  ogImage: '/favicon.ico',
  ogUrl: '[og:url]',

  twitterTitle: 'Gambit Reborn',
  twitterDescription: 'Play Chess with friends online!',
  twitterImage: '/favicon.ico',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico'
    }
  ]
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
