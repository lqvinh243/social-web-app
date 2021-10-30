<template>
    <h1>Hello world</h1>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    layout: 'default',
    middleware: ['authentication'],
    async mounted() {
    }
});
</script>
