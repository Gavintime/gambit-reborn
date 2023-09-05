export default defineEventHandler((_) => {
  return {
    code: Math.floor(Math.random() * 1000000)
  }
})
