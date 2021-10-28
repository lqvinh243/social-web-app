<template>
    <h1>Hello world</h1>
</template>
<script lang="ts">
import Vue from 'vue';
import { authService } from '~/services/auth';

export default Vue.extend({
    layout: 'default',
    middleware: ['authentication'],
    async mounted() {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNzkzODhiZTliZjQxNzdjNjRjYzQ4NCIsImlhdCI6MTYzNTM4NzA0NiwiZXhwIjoxNjM1NDczNDQ2fQ.Fd61miph_oKM9cmSllSEWCWTKPTPUj26nN_ICbRiYSQ';
        await authService.authenticate(token);
    }
});
</script>
