<template>
  <div class="flex gap-4 flex-col">
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <Card v-for="index in 3" :key="index" class="aspect-video">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          Card Content
        </CardContent>
        <CardFooter>
          Card Footer
        </CardFooter>
      </Card>
    </div>
    <Card class="flex-1">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        Card Content
      </CardContent>
      <CardFooter>
        Card Footer
      </CardFooter>
    </Card>
  </div>
</template>

<script lang="js" setup>
definePageMeta({
  title: 'Home',
  description: 'This is the home page',
  layout: 'sidebar'
})
</script>