<template>
    <div>
        <v-app-bar color="deep-purple accent-4" dense dark>
            <v-app-bar-nav-icon v-if="showMenuBar" @click="handleDrawer()" />

            <v-toolbar-title>
                <NuxtLink :to="`/`">
                    <span style="color:white"> Trang chủ </span>
                </NuxtLink>
            </v-toolbar-title>
            <div class="search-header">
                <v-autocomplete
                    v-model="select"
                    :loading="loading"
                    :items="listSearch"
                    :search-input.sync="search"
                    cache-items
                    class="mx-4"
                    flat
                    :dense="true"
                    hide-no-data
                    hide-details
                    label="Nhập tên, điện thoại, máy tính..."
                    solo-inverted
                />
            </div>
            <v-spacer />
            <v-menu offset-y>
                <template #activator="{ on, attrs }">
                    <p>
                        Xin chào,&nbsp;
                    </p>
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-avatar>
                            <img
                                src="https://cdn.vuetifyjs.com/images/john.jpg"
                                alt="John"
                            >
                        </v-avatar>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item v-for="n in dropdownSelection" :key="n.id" @click="handleRedirect(n.id)">
                        <v-list-item-title>
                            {{ n.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import eventBus from '~/plugins/event-bus';

export default Vue.extend({
    data: () => ({
        items: [
            { title: 'Điện thoại di động', id: 'mobile' },
            { title: 'Máy tính xách tay', id: 'laptop' }
        ],
        profiles: [
            { title: 'Đăng nhập', id: 'login', isAuth: false },
            { title: 'Đăng ký', id: 'register', isAuth: false },
            { title: 'Thông tin cá nhân', id: 'my-profile', isAuth: true },
            { title: 'Đăng xuất', id: 'logout', isAuth: true }],
        listSearch: [],
        loading: false,
        search: null,
        select: null,
    }),
    computed: {
        dropdownSelection():any {
            return this.profiles.filter((item:any) => item.isAuth === this.$auth.isAuthenticated());
        },

        showMenuBar():boolean {
            return this.$auth.isAuthenticated();
        }
    },

    watch: {
        search(val) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout(() => {
                if (val || val === '' || val.length) {
                    if (this.$route.path !== '/product')
                        this.$router.push(`/product?query=${val}`);
                    else eventBus.$emit('CHANGE_QUERY_SEARCH', val);
                }
                this.loading = false;
            }, 2000);
        },
    },
    methods: {
        ...mapActions('auth', [
            'clearAuthentication',
        ]),
        handleDrawer() {
            this.$emit('emitDrawer');
        },
        querySelections(v: any) {
            this.loading = true;
            // Simulated ajax query
            setTimeout(() => {
                if (this.$route.path !== '/product')
                    this.$router.push(`/product?query=${v}`);

                this.loading = false;
            }, 2000);
        },
        handleRedirect(path: string) {
            switch (path) {
            case 'logout':
                this.clearAuthentication();
                this.$router.push('/login');
                break;
            case 'my-profile':
            case 'register':
            case 'login':
                this.$router.push(`/${path}`);
                break;
            }
        }
    }
});
</script>

<style scoped>
    .v-autocomplete__content .v-list__tile{
        height: auto;
    }

    .search-header{
        width: 30%
    }
</style>
