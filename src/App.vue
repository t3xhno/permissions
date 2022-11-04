<script setup lang="ts">
</script>

<template>
  <div id="nav" class="container mx-auto">
    <div class="flex space-x-4">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/moderator">Moderator</RouterLink>
      <RouterLink to="/admin">Admin</RouterLink>
    </div>
    <RouterView />
  </div>
</template>
