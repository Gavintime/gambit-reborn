<script setup>
const appConfig = useAppConfig()

useSeoMeta({
  title: appConfig.title,
  description: appConfig.description,

  ogTitle: appConfig.title,
  ogDescription: appConfig.description,
  ogImage: appConfig.icon,
  ogUrl: '[og:url]',

  twitterTitle: appConfig.title,
  twitterDescription: appConfig.description,
  twitterImage: appConfig.icon,
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: appConfig.icon
    }
  ]
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
