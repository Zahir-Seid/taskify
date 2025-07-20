<script setup>
import TaskPage from './TaskPage.vue'
</script>

<template>
  <TaskPage />
</template>

<style scoped>
/* Ensure fonts are loaded */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;700;900&display=swap');

body {
  font-family: 'Open Sans', sans-serif;
}

/* Custom styles for select dropdown */
select {
  background-image: none;
}

/* Smooth transitions */
button, select, input {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
}
</style>